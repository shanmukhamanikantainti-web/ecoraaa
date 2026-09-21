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

    # AI Models
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


settings = PegasusSettings()
