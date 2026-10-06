"""
Leagues & live leaderboard (Section 7.7) — no scheduler needed.

* Weeks start Monday 00:00 in the user's (simulated) timezone.
* Bots' weekly XP is a deterministic function of how far into the week we are,
  their personal XP/day rate, and a jitter seeded by (bot_id, week). So the
  table "moves" every time it is viewed, but is reproducible.
* The real learner's weekly XP is the sum of their xp_events this week.
* Rollover is lazy: the first request after a week ends finalises it.
"""

import random
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core import clock
from app.models.gamification import LeagueGroup, LeagueMembership, LeagueTier
from app.models.user import User
from app.services import xp_service

GROUP_SIZE = 30
PROMOTE_TOP = 10
DEMOTE_BOTTOM = 5
MAX_TIER = 10


@dataclass
class Standing:
    rank: int
    user: User
    weekly_xp: int


# ---------------------------------------------------------------------------
# Pure helpers
# ---------------------------------------------------------------------------
def bot_weekly_xp(bot_id: int, xp_per_day: int, week: date, elapsed_days: float) -> int:
    """
    XP a bot has 'earned' so far this week.
    jitter in [0.6, 1.4] is fixed for (bot, week); XP comes in 5-point chunks like real lessons.
    """
    rng = random.Random(f"{bot_id}:{week.isoformat()}")
    jitter = 0.6 + rng.random() * 0.8
    raw = xp_per_day * jitter * max(0.0, min(7.0, elapsed_days))
    return int(raw // 5) * 5


def rank_members(xp_by_user: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    """
    Sort (user_id, weekly_xp, join_order) by XP desc, then earlier join.
    Returns (rank, user_id, weekly_xp).
    """
    ordered = sorted(xp_by_user, key=lambda r: (-r[1], r[2]))
    return [(i + 1, uid, xp) for i, (uid, xp, _) in enumerate(ordered)]


def result_for_rank(rank: int, size: int, tier: int) -> str:
    """Top 10 promote, bottom 5 demote — clamped at Bronze / Diamond."""
    if rank <= PROMOTE_TOP and tier < MAX_TIER:
        return "promoted"
    if rank > size - DEMOTE_BOTTOM and tier > 1:
        return "demoted"
    return "stayed"


def next_tier(tier: int, result: str) -> int:
    if result == "promoted":
        return min(MAX_TIER, tier + 1)
    if result == "demoted":
        return max(1, tier - 1)
    return tier


# ---------------------------------------------------------------------------
# DB logic
# ---------------------------------------------------------------------------
def _week_start_dt(user: User, week: date) -> datetime:
    tz = clock.local_now(user).tzinfo
    return datetime.combine(week, time.min, tzinfo=tz)


def _elapsed_days(user: User, week: date) -> float:
    return (clock.local_now(user) - _week_start_dt(user, week)).total_seconds() / 86400


def _current_membership(db: Session, user: User) -> Optional[LeagueMembership]:
    return db.scalar(
        select(LeagueMembership)
        .join(LeagueGroup)
        .where(LeagueMembership.user_id == user.id)
        .order_by(LeagueGroup.week_start.desc(), LeagueGroup.id.desc())
    )


def _create_group(db: Session, user: User, week: date, tier: int) -> LeagueMembership:
    """New 30-person group: the learner + 29 bots."""
    group = LeagueGroup(week_start=week, tier=tier, created_at=clock.utc_now())
    db.add(group)
    db.flush()
    bots = db.scalars(select(User).where(User.is_bot.is_(True)).order_by(User.id).limit(GROUP_SIZE - 1)).all()
    membership = LeagueMembership(group_id=group.id, user_id=user.id, weekly_xp=0, result="pending")
    db.add(membership)
    for bot in bots:
        db.add(LeagueMembership(group_id=group.id, user_id=bot.id, weekly_xp=0, result="pending"))
    db.flush()
    return membership


def _member_xp(db: Session, user: User, member: User, week: date, elapsed: float) -> int:
    if member.is_bot:
        return bot_weekly_xp(member.id, member.bot_xp_per_day or 30, week, elapsed)
    return xp_service.xp_between(db, member.id, week, week + timedelta(days=6))


def _refresh_group(db: Session, user: User, group: LeagueGroup, final: bool = False) -> list[Standing]:
    """Recompute every member's weekly XP, persist it, and return the ranking."""
    elapsed = 7.0 if final else _elapsed_days(user, group.week_start)
    members = {m.user_id: m for m in group.memberships}
    users = {u.id: u for u in db.scalars(select(User).where(User.id.in_(members.keys())))}
    rows = []
    for order, (uid, membership) in enumerate(sorted(members.items(), key=lambda kv: kv[1].id)):
        membership.weekly_xp = _member_xp(db, user, users[uid], group.week_start, elapsed)
        rows.append((uid, membership.weekly_xp, order))
    return [Standing(rank, users[uid], xp) for rank, uid, xp in rank_members(rows)]


def _finalize(db: Session, user: User, membership: LeagueMembership) -> None:
    """Close a finished week: store ranks/results and move the learner's tier."""
    group = membership.group
    standings = _refresh_group(db, user, group, final=True)
    size = len(standings)
    for standing in standings:
        m = next(m for m in group.memberships if m.user_id == standing.user.id)
        m.final_rank = standing.rank
        m.result = result_for_rank(standing.rank, size, group.tier)
    user.league_tier = next_tier(group.tier, membership.result)


def ensure_current_group(db: Session, user: User) -> LeagueMembership:
    """Return this week's membership, rolling over a finished week if needed."""
    week = clock.week_start(clock.today(user))
    membership = _current_membership(db, user)
    if membership is not None and membership.group.week_start == week:
        return membership
    if membership is not None and membership.group.week_start < week and membership.result == "pending":
        _finalize(db, user, membership)
    elif membership is not None and membership.group.week_start > week:
        # Time travelled backwards past the current group: just reuse it.
        return membership
    return _create_group(db, user, week, user.league_tier)


def standings(db: Session, user: User) -> tuple[LeagueMembership, list[Standing]]:
    membership = ensure_current_group(db, user)
    ranking = _refresh_group(db, user, membership.group)
    db.flush()
    return membership, ranking


def last_result(db: Session, user: User) -> Optional[LeagueMembership]:
    """Most recent finalised week the user has not dismissed yet."""
    return db.scalar(
        select(LeagueMembership)
        .join(LeagueGroup)
        .where(
            LeagueMembership.user_id == user.id,
            LeagueMembership.result != "pending",
            LeagueMembership.result_seen.is_(False),
        )
        .order_by(LeagueGroup.week_start.desc())
    )


def top_three_finishes(db: Session, user: User) -> int:
    rows = db.scalars(
        select(LeagueMembership).where(
            LeagueMembership.user_id == user.id, LeagueMembership.final_rank.is_not(None)
        )
    )
    return sum(1 for m in rows if m.final_rank is not None and m.final_rank <= 3)


def tier_info(db: Session, tier: int) -> LeagueTier:
    info = db.get(LeagueTier, tier)
    if info is None:
        return LeagueTier(tier=tier, name="Bronze", color_hex="#CD7F32")
    return info


def week_end(user: User, week: date) -> datetime:
    return _week_start_dt(user, week) + timedelta(days=7)
