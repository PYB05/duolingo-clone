"""
Simulated clock for streaks, quests, hearts and leagues (Section 7.1).

    now(user)   = real UTC now + user.settings.debug_day_offset days
    today(user) = now(user) converted to the user's timezone -> date

Rules:
  - ALL "today/now" calculations go through this module.
  - Never call datetime.now() anywhere else in the app.
  - Tests can call `freeze(datetime)` to pin the real clock.
"""

from datetime import date, datetime, timedelta, timezone, tzinfo
from typing import TYPE_CHECKING, Optional
from zoneinfo import ZoneInfo

from app.core.config import settings

if TYPE_CHECKING:
    from app.models.user import User

# When set (tests only), replaces the real "UTC now".
_frozen_utc: Optional[datetime] = None


def freeze(moment: Optional[datetime]) -> None:
    """Pin the real clock to `moment` (UTC-aware). Pass None to unfreeze. Test helper."""
    global _frozen_utc
    _frozen_utc = moment


def utc_now() -> datetime:
    """Real UTC now (or the frozen test time). Used for created_at timestamps."""
    return _frozen_utc if _frozen_utc is not None else datetime.now(tz=timezone.utc)


def _tz(timezone_name: Optional[str] = None) -> tzinfo:
    return ZoneInfo(timezone_name or settings.DEFAULT_TIMEZONE)


def _offset_days(user: Optional["User"]) -> int:
    if user is None or user.settings is None:
        return 0
    return user.settings.debug_day_offset


def now(user: Optional["User"] = None) -> datetime:
    """The user's simulated 'now' as an aware UTC datetime (real now + day offset)."""
    return utc_now() + timedelta(days=_offset_days(user))


def local_now(user: Optional["User"] = None) -> datetime:
    """The user's simulated 'now' expressed in their own timezone."""
    tz_name = user.timezone if user is not None else None
    return now(user).astimezone(_tz(tz_name))


def today(user: Optional["User"] = None) -> date:
    """The user's simulated calendar date. Canonical 'today' for streaks/quests/goals."""
    return local_now(user).date()


def week_start(day: date) -> date:
    """Monday of the week containing `day` (league weeks start on Monday)."""
    return day - timedelta(days=day.weekday())


def month_start(day: date) -> date:
    """First day of the month containing `day` (monthly quests)."""
    return day.replace(day=1)


def as_aware(moment: datetime) -> datetime:
    """SQLite drops tzinfo on read; treat naive datetimes as UTC."""
    return moment if moment.tzinfo is not None else moment.replace(tzinfo=timezone.utc)
