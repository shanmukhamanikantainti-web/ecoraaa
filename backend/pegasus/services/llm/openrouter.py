"""
PEGASUS OS — OpenRouter & LLM Service
"""

import logging
import os
from typing import Any, Optional, List, Dict
import httpx
from ...config.settings import settings

logger = logging.getLogger("pegasus.services.llm")


class OpenRouterLLMService:
    """
    Backend service for interacting with OpenRouter API.
    Guarantees API keys are kept strictly within backend environment.
    """

    def __init__(self):
        self.api_key = settings.openrouter_api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = settings.openrouter_model or os.getenv("OPENROUTER_MODEL", "google/gemma-4-26b-a4b-it:free")
        self.base_url = settings.openrouter_base_url or os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

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
    ) -> str:
        """
        Execute chat completion using configured OpenRouter model.
        Falls back cleanly if API key is missing or service is unavailable.
        """
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        formatted_messages.extend(messages)

        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY is not configured in backend environment.")
            return "[Backend Info] OPENROUTER_API_KEY not set. Operating in offline deterministic mode."

        payload: Dict[str, Any] = {
            "model": self.model,
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
                response.raise_for_status()
                data = response.json()
                choices = data.get("choices", [])
                if choices:
                    message_obj = choices[0].get("message", {})
                    content = message_obj.get("content", "")
                    if content:
                        return content
                return f"[OpenRouter] Received empty response from model {self.model}."
        except httpx.HTTPStatusError as e:
            logger.error(f"OpenRouter HTTP Error: {e.response.status_code} - {e.response.text}")
            return f"[OpenRouter Error] HTTP {e.response.status_code}: {e.response.text[:200]}"
        except Exception as e:
            logger.error(f"OpenRouter Connection Error: {e}")
            return f"[OpenRouter Error] Failed to connect: {str(e)}"

# Singleton instance
llm_service = OpenRouterLLMService()
