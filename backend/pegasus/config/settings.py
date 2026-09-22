"""
PEGASUS OS — Configuration Settings
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional


class PegasusSettings(BaseSettings):
    """PEGASUS Core configuration."""

    # Server
    host: str = "0.0.0.0"
    port: int = 8420

    # OpenRouter AI Model
    openrouter_api_key: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    openrouter_model: str = os.getenv("OPENROUTER_MODEL", "google/gemma-4-26b-a4b-it:free")
    openrouter_base_url: str = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

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

