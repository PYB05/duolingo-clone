"""
User profile and settings endpoints (/me).
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core import clock
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.errors import AppError
from app.models.user import User
from app.schemas.api import UpdateMeSchema, UpdateUserSettingsSchema, UserMeResponse, UserSettingsSchema
from app.services import hearts_service, streak_service, xp_service

router = APIRouter(prefix="/me", tags=["me"])


@router.get("", response_model=UserMeResponse)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch current user state with regenerated hearts and active streak calculation."""
    hearts_service.apply_regen(db, user)
    db.commit()

    t_date = clock.today(user)
    disp_streak = streak_service.displayed_streak(
        user.current_streak, user.last_activity_date, t_date, user.streak_freezes
    )
    is_extended = streak_service.is_extended_today(user.last_activity_date, t_date)
    nxt_heart = hearts_service.next_heart_in(user)
    t_xp = xp_service.today_xp(db, user)

    return UserMeResponse(
        id=user.id,
        username=user.username,
        display_name=user.display_name,
        avatar_color=user.avatar_color,
        total_xp=user.total_xp,
        gems=user.gems,
        hearts=user.hearts,
        next_heart_in_seconds=nxt_heart,
        current_streak=user.current_streak,
        displayed_streak=disp_streak,
        longest_streak=user.longest_streak,
        is_streak_extended_today=is_extended,
        today_xp=t_xp,
        daily_goal_xp=user.daily_goal_xp,
        streak_freezes=user.streak_freezes,
        league_tier=user.league_tier,
        settings=UserSettingsSchema(
            sound_effects=user.settings.sound_effects,
            animations=user.settings.animations,
            theme=user.settings.theme,
            listening_exercises=user.settings.listening_exercises,
            debug_day_offset=user.settings.debug_day_offset,
        ),
        simulated_today=t_date.isoformat(),
    )


@router.patch("", response_model=UserMeResponse)
def update_me(
    payload: UpdateMeSchema,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile attributes like display_name or daily_goal_xp."""
    if payload.display_name is not None:
        name = payload.display_name.strip()
        if not name:
            raise AppError("INVALID_NAME", "Display name cannot be empty.", 400)
        user.display_name = name

    if payload.daily_goal_xp is not None:
        if payload.daily_goal_xp not in (10, 20, 30, 50):
            raise AppError("INVALID_GOAL", "Daily goal must be 10, 20, 30, or 50 XP.", 400)
        user.daily_goal_xp = payload.daily_goal_xp

    db.commit()
    return get_me(user=user, db=db)


@router.get("/settings", response_model=UserSettingsSchema)
def get_settings(user: User = Depends(get_current_user)):
    return UserSettingsSchema(
        sound_effects=user.settings.sound_effects,
        animations=user.settings.animations,
        theme=user.settings.theme,
        listening_exercises=user.settings.listening_exercises,
        debug_day_offset=user.settings.debug_day_offset,
    )


@router.patch("/settings", response_model=UserSettingsSchema)
def update_settings(
    payload: UpdateUserSettingsSchema,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.sound_effects is not None:
        user.settings.sound_effects = payload.sound_effects
    if payload.animations is not None:
        user.settings.animations = payload.animations
    if payload.theme is not None:
        if payload.theme not in ("system", "light", "dark"):
            raise AppError("INVALID_THEME", "Theme must be system, light, or dark.", 400)
        user.settings.theme = payload.theme
    if payload.listening_exercises is not None:
        user.settings.listening_exercises = payload.listening_exercises

    db.commit()
    return get_settings(user=user)
