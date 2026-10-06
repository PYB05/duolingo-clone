"""
FastAPI dependencies shared across routers.

Auth simplification (Section 10):
  get_current_user reads an optional X-User-Id header and defaults to the
  seeded "learner" user. This avoids real auth while keeping every endpoint
  user-aware.
"""

from typing import Optional

from fastapi import Depends, Header
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.errors import DevToolsDisabledError, NotFoundError
from app.models.user import User

DEFAULT_USERNAME = "learner"


def get_current_user(
    db: Session = Depends(get_db),
    x_user_id: Optional[int] = Header(default=None),
) -> User:
    """Return the acting user: X-User-Id if given, else the seeded demo learner."""
    if x_user_id is not None:
        user = db.get(User, x_user_id)
    else:
        user = db.scalar(select(User).where(User.username == DEFAULT_USERNAME))
    if user is None or user.is_bot:
        raise NotFoundError("User")
    return user


def require_dev_tools() -> None:
    """Guard for /dev endpoints."""
    if not settings.ENABLE_DEV_TOOLS:
        raise DevToolsDisabledError()
