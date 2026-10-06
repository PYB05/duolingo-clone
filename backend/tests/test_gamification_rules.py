"""
Tests for hearts regen and streak calculation pure rules.
"""

from datetime import date, datetime, timedelta, timezone

from app.services.hearts_service import compute_regen, seconds_until_next_heart
from app.services.streak_service import compute_streak_update, displayed_streak


def test_hearts_regen_partial():
    # 5 hours = 18000s
    updated = datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
    # 2 hours later: 0 hearts gained
    now = updated + timedelta(hours=2)
    res = compute_regen(hearts=3, updated_at=updated, now=now, interval_seconds=18000)
    assert res.hearts == 3
    assert res.gained == 0

    # 10.5 hours later: 2 hearts gained
    now = updated + timedelta(hours=10, minutes=30)
    res = compute_regen(hearts=3, updated_at=updated, now=now, interval_seconds=18000)
    assert res.hearts == 5
    assert res.gained == 2


def test_seconds_until_next_heart():
    updated = datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
    now = updated + timedelta(hours=1)
    secs = seconds_until_next_heart(hearts=4, updated_at=updated, now=now, interval_seconds=18000)
    assert secs == 18000 - 3600

    # When full, returns None
    assert seconds_until_next_heart(hearts=5, updated_at=updated, now=now, interval_seconds=18000) is None


def test_streak_consecutive_days():
    today = date(2026, 1, 10)
    yesterday = date(2026, 1, 9)

    # Yesterday active -> streak + 1
    res = compute_streak_update(current=5, longest=5, last_activity=yesterday, today=today, freezes=0)
    assert res.after == 6
    assert res.extended is True
    assert res.longest == 6


def test_streak_same_day():
    today = date(2026, 1, 10)
    res = compute_streak_update(current=5, longest=5, last_activity=today, today=today, freezes=0)
    assert res.after == 5
    assert res.extended is False


def test_streak_missed_day_with_freeze():
    today = date(2026, 1, 10)
    two_days_ago = date(2026, 1, 8)

    # Missed Jan 9, but owns 1 freeze -> freeze consumed, streak preserved and extended!
    res = compute_streak_update(current=5, longest=5, last_activity=two_days_ago, today=today, freezes=1)
    assert res.after == 6
    assert res.freeze_used_on == date(2026, 1, 9)
    assert res.extended is True


def test_streak_broken():
    today = date(2026, 1, 10)
    old = date(2026, 1, 5)

    res = compute_streak_update(current=5, longest=10, last_activity=old, today=today, freezes=0)
    assert res.after == 1
    assert res.longest == 10


def test_displayed_streak_zero_when_broken():
    today = date(2026, 1, 10)
    # Gap > 1 day without freeze -> flame is grey (displayed streak = 0)
    assert displayed_streak(current=7, last_activity=date(2026, 1, 8), today=today, freezes=0) == 0
    # Alive if yesterday was active
    assert displayed_streak(current=7, last_activity=date(2026, 1, 9), today=today, freezes=0) == 7
