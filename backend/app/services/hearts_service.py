"""
Hearts rules (Section 7.5).

Regeneration is *lazy*: there is no background job. Whenever we read or change
hearts we first "catch up" using the time elapsed since `hearts_updated_at`.
"""

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.core import clock
from app.core.config import settings
from app.models.gamification import HeartEvent
from app.models.user import User

MAX_HEARTS = 5


@dataclass
class RegenResult:
    hearts: int
    updated_at: datetime
    gained: int


def compute_regen(
    hearts: int, updated_at: datetime, now: datetime, interval_seconds: int
) -> RegenResult:
    """
    Pure regen math.
      gained  = floor((now - updated_at) / interval)
      hearts  = min(5, hearts + gained)
      updated_at advances by gained * interval (or resets to `now` once full),
      so partial progress towards the next heart is never lost.
    """
    if hearts >= MAX_HEARTS:
        return RegenResult(MAX_HEARTS, now, 0)
    if updated_at > now:  # clock moved backwards (time travel reset)
        return RegenResult(hearts, now, 0)
    elapsed = (now - updated_at).total_seconds()
    gained = int(elapsed // interval_seconds)
    new_hearts = min(MAX_HEARTS, hearts + gained)
    if new_hearts >= MAX_HEARTS:
        return RegenResult(MAX_HEARTS, now, new_hearts - hearts)
    return RegenResult(
        new_hearts, updated_at + timedelta(seconds=gained * interval_seconds), gained
    )


def seconds_until_next_heart(
    hearts: int, updated_at: datetime, now: datetime, interval_seconds: int
) -> Optional[int]:
    """None when full, otherwise seconds left until the next heart arrives."""
    if hearts >= MAX_HEARTS:
        return None
    elapsed = max(0.0, (now - updated_at).total_seconds())
    return max(0, int(interval_seconds - elapsed))


# ---------------------------------------------------------------------------
# DB-aware helpers
# ---------------------------------------------------------------------------
def regen_interval(user: User) -> int:
    """Per-user override (dev 'fast hearts') or the configured default."""
    if user.settings and user.settings.hearts_regen_seconds_override:
        return user.settings.hearts_regen_seconds_override
    return settings.HEART_REGEN_SECONDS


def apply_regen(db: Session, user: User) -> None:
    """Catch the user's hearts up to 'now'. Call before reading or changing hearts."""
    result = compute_regen(
        user.hearts, clock.as_aware(user.hearts_updated_at), clock.now(user), regen_interval(user)
    )
    if result.gained > 0:
        db.add(_event(user, result.gained, "regen"))
    user.hearts = result.hearts
    user.hearts_updated_at = result.updated_at


def next_heart_in(user: User) -> Optional[int]:
    return seconds_until_next_heart(
        user.hearts, clock.as_aware(user.hearts_updated_at), clock.now(user), regen_interval(user)
    )


def change_hearts(
    db: Session, user: User, delta: int, reason: str, attempt_id: Optional[int] = None
) -> int:
    """Add/remove hearts (clamped 0..5), log a heart_event, return the new count."""
    apply_regen(db, user)
    new_value = max(0, min(MAX_HEARTS, user.hearts + delta))
    actual = new_value - user.hearts
    if actual != 0:
        if user.hearts >= MAX_HEARTS and actual < 0:
            # Leaving 'full' starts the regen timer now.
            user.hearts_updated_at = clock.now(user)
        user.hearts = new_value
        db.add(_event(user, actual, reason, attempt_id))
    return user.hearts


def _event(user: User, delta: int, reason: str, attempt_id: Optional[int] = None) -> HeartEvent:
    return HeartEvent(
        user_id=user.id,
        delta=delta,
        reason=reason,
        attempt_id=attempt_id,
        created_at=clock.utc_now(),
    )
