"""
Profile router: user stats, streak calendar, 7-day XP chart, and achievements showcase.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core import clock
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.gamification import DailyActivity
from app.models.user import User
from app.schemas.api import ProfileResponse
from app.services import achievement_service, league_service, streak_service, xp_service

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileResponse)
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch user profile overview, activity history, and achievement summary."""
    # 1. League tier name
    tier_info = league_service.tier_info(db, user.league_tier)
    top_3 = league_service.top_three_finishes(db, user)

    # 2. 7-day weekly XP chart
    series = xp_service.daily_xp_series(db, user, days=7)
    chart_out = [{"date": d.isoformat(), "day_name": d.strftime("%a"), "xp": val} for d, val in series]

    # 3. Active dates for calendar
    acts = db.scalars(
        select(DailyActivity.activity_date)
        .where(DailyActivity.user_id == user.id)
        .order_by(DailyActivity.activity_date)
    ).all()
    active_days_out = [a.isoformat() for a in acts]

    # 4. Achievements summary
    achievement_service.evaluate(db, user, grant_rewards=False)
    db.commit()

    # Calculate active displayed streak
    t_date = clock.today(user)
    disp_streak = streak_service.displayed_streak(
        user.current_streak, user.last_activity_date, t_date, user.streak_freezes
    )

    return ProfileResponse(
        username=user.username,
        display_name=user.display_name,
        avatar_color=user.avatar_color,
        joined_date=user.joined_at.strftime("%B %Y"),
        day_streak=disp_streak,
        total_xp=user.total_xp,
        current_league=tier_info.name,
        top_3_finishes=top_3,
        weekly_xp_chart=chart_out,
        active_days=active_days_out,
        achievements_summary=[],
    )
