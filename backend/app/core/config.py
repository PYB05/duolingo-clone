"""
Configuration module using pydantic-settings.
Reads from .env file and environment variables.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    # Database
    DATABASE_URL: str = "sqlite:///./data/app.db"

    # CORS — comma-separated origins
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000,*"

    # Hearts regeneration interval in seconds (default 5 hours = 18000)
    HEART_REGEN_SECONDS: int = 18000

    # Enable developer tools (/dev endpoints, time travel, etc.)
    ENABLE_DEV_TOOLS: bool = True

    # Default timezone for the simulated clock
    DEFAULT_TIMEZONE: str = "Asia/Kolkata"

    # Auto-seed the database on startup (useful for ephemeral disks)
    SEED_ON_STARTUP: bool = True

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS_ORIGINS into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


# Singleton — import this wherever settings are needed.
settings = Settings()
