"""
Gems (mock currency, Section 7.4). Every change writes a gem_transactions row;
the balance can never go negative.
"""

from typing import Optional

from sqlalchemy.orm import Session

from app.core import clock
from app.core.errors import InsufficientGemsError
from app.models.gamification import GemTransaction
from app.models.user import User


def change_gems(
    db: Session, user: User, delta: int, reason: str, ref_id: Optional[int] = None
) -> int:
    """Apply a gem delta, refusing to overdraw. Returns the new balance."""
    if user.gems + delta < 0:
        raise InsufficientGemsError(required=-delta, available=user.gems)
    user.gems += delta
    db.add(
        GemTransaction(
            user_id=user.id, delta=delta, reason=reason, ref_id=ref_id, created_at=clock.utc_now()
        )
    )
    return user.gems
