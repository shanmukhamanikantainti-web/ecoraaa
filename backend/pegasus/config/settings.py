"""
PEGASUS OS — Configuration Settings
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

# Search and load .env from current dir, backend dir, and repo root
for env_path in [
    Path.cwd() / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent.parent / ".env",
]:
    if env_path.exists():
        load_dotenv(env_path, override=True)


class PegasusSettings(BaseSettings):
    """PEGASUS Core configuration."""

    # Server
    host: str = "0.0.0.0"
    port: int = 8420

    # OpenRouter AI Model
    openrouter_api_key: Optional[str] = os.getenv("OPENROUTER_API_KEY") or os.getenv("PEGASUS_OPENROUTER_API_KEY")
    openrouter_model: str = os.getenv("OPENROUTER_MODEL", "google/gemma-4-26b-a4b-it:free")
    openrouter_base_url: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    openrouter_max_retries: int = int(os.getenv("OPENROUTER_MAX_RETRIES", "3"))
    openrouter_retry_base_seconds: float = float(os.getenv("OPENROUTER_RETRY_BASE_SECONDS", "2"))
    openrouter_fallback_models: str = os.getenv("OPENROUTER_FALLBACK_MODELS", "deepseek/deepseek-r1:free,meta-llama/llama-3.3-70b-instruct:free")

    # Legacy AI Models
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4"
    anthropic_api_key: Optional[str] = None
    anthropic_model: str = "claude-3-opus-20240229"
    use_local_model: bool = False
    local_model_path: Optional[str] = None

    # Agent settings
    max_agent_retries: int = 3
    max_agent_runtime_seconds: int = 300
    max_concurrent_agents: int = 5

    # Memory
    database_url: str = "sqlite+aiosqlite:///pegasus_memory.db"

    # Security
    require_confirmation_for_destructive: bool = True
    enable_permission_checks: bool = True

    # Logging
    log_level: str = "INFO"
    activity_log_path: str = "pegasus_activity.log"

    class Config:
        env_prefix = "PEGASUS_"
        env_file = ".env"
        extra = "ignore"


settings = PegasusSettings()

