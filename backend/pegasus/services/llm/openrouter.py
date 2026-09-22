import logging
import os
import asyncio
import random
import time
from typing import Any, Optional, List, Dict, Callable
import httpx
from ...config.settings import settings

logger = logging.getLogger("pegasus.services.llm")


class OpenRouterLLMService:
    """
    Backend service for interacting with OpenRouter API.
    Guarantees API keys are kept strictly within backend environment.
    """

    def __init__(self):
        self._api_key = settings.openrouter_api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = settings.openrouter_model or os.getenv("OPENROUTER_MODEL", "google/gemma-4-26b-a4b-it:free")
        self.base_url = settings.openrouter_base_url or os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        self.max_retries = settings.openrouter_max_retries
        self.retry_base = settings.openrouter_retry_base_seconds
        self.fallback_models = [m.strip() for m in settings.openrouter_fallback_models.split(",") if m.strip()]

    @property
    def api_key(self) -> str:
        return (
            os.getenv("OPENROUTER_API_KEY")
            or os.getenv("PEGASUS_OPENROUTER_API_KEY")
            or settings.openrouter_api_key
            or self._api_key
            or ""
        )

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ecoraa.ai",
            "X-Title": "ECORAA Desktop",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 2000,
        tools: Optional[List[Dict[str, Any]]] = None,
        on_event: Optional[Callable[[str, Any], Any]] = None,
        task_id: Optional[str] = None,
    ) -> str:
        """
        Execute chat completion using configured OpenRouter model.
        Implements HTTP 429 retry logic with exponential backoff and model fallbacks.
        """
        if not self.api_key:
            logger.error("OPENROUTER_API_KEY is not configured in backend environment.")
            return "[Error: LLM_NOT_CONFIGURED] OPENROUTER_API_KEY is not set on the ECORAA backend server. Please configure OPENROUTER_API_KEY in backend/.env file."

        # Prepare models list: Primary model followed by fallback models
        models_to_try = [self.model] + self.fallback_models

        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        formatted_messages.extend(messages)

        last_error = ""

        for model_index, current_model in enumerate(models_to_try):
            if model_index > 0:
                logger.info(f"Falling back to model: {current_model}")
                if on_event:
                    await on_event("LLM_PROVIDER_CHANGED", {
                        "task_id": task_id,
                        "requested_model": self.model,
                        "actual_model": current_model
                    })

            for attempt in range(self.max_retries + 1):
                payload: Dict[str, Any] = {
                    "model": current_model,
                    "messages": formatted_messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }

                if tools:
                    payload["tools"] = tools

                url = f"{self.base_url.rstrip('/')}/chat/completions"

                try:
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        response = await client.post(url, headers=self._get_headers(), json=payload)

                        if response.status_code == 429:
                            last_error = f"HTTP 429: {response.text}"
                            retry_after = response.headers.get("Retry-After")
                            if retry_after and retry_after.isdigit():
                                delay = int(retry_after)
                            else:
                                # Exponential backoff with jitter
                                delay = self.retry_base * (2 ** attempt) + (random.random() * 1.0)

                            if attempt < self.max_retries:
                                logger.warning(f"OpenRouter rate limit on {current_model} (attempt {attempt+1}/{self.max_retries}). Retrying in {delay:.1f}s...")
                                if on_event:
                                    await on_event("LLM_RETRYING", {
                                        "task_id": task_id,
                                        "attempt": attempt + 1,
                                        "delay_seconds": delay,
                                        "model": current_model
                                    })
                                await asyncio.sleep(delay)
                                continue
                            else:
                                # Max retries reached for this model
                                logger.error(f"Max retries reached for model {current_model}")
                                break # Break inner loop, try next model if available

                        response.raise_for_status()
                        data = response.json()
                        choices = data.get("choices", [])
                        if choices:
                            message_obj = choices[0].get("message", {})
                            content = message_obj.get("content", "")
                            if content:
                                # Success!
                                return content

                        last_error = f"Empty response from model {current_model}"
                        break # Try next model if available

                except httpx.HTTPStatusError as e:
                    last_error = f"HTTP {e.response.status_code}: {e.response.text[:200]}"
                    logger.error(f"OpenRouter HTTP Error on {current_model}: {last_error}")
                    # For non-429 errors, try next model immediately unless it's 401/403
                    if e.response.status_code in [401, 403]:
                        return f"[Error: LLM_AUTH_FAILED] {last_error}"
                    break # Try next model

                except Exception as e:
                    last_error = f"Connection Error: {str(e)}"
                    logger.error(f"OpenRouter Connection Error on {current_model}: {last_error}")
                    break # Try next model

        # If we reached here, all models and retries failed
        if "429" in last_error:
            return f"[Error: LLM_RATE_LIMITED] The AI provider is temporarily rate-limited. Please try again shortly or configure more fallback models. Details: {last_error}"

        return f"[Error: LLM_FAILED] Failed to get response from any configured model. Last error: {last_error}"

# Singleton instance
llm_service = OpenRouterLLMService()
