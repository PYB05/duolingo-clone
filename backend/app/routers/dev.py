"""
Developer tools router for streak time-travel, testing, and demos.
Protected by require_dev_tools.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core import clock
from app.core.database import get_db
from app.core.deps import get_current_user, require_dev_tools
from app.models.progress import UserSkillProgress
from app.models.skill import Skill
from app.models.user import User
from app.schemas.api import DevAddGemsRequest, DevAddXPRequest, DevSetHeartsRequest, DevTimeTravelRequest
from app.services import gem_service, hearts_service, xp_service

router = APIRouter(prefix="/dev", tags=["dev"], dependencies=[Depends(require_dev_tools)])


@router.post("/time-travel")
def time_travel(
    payload: DevTimeTravelRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Shift the user's simulated clock by `days` (positive = future, negative = past)."""
    user.settings.debug_day_offset += payload.days
    db.commit()
    new_today = clock.today(user)
    return {
        "debug_day_offset": user.settings.debug_day_offset,
        "simulated_today": new_today.isoformat(),
        "message": f"Time travelled {payload.days} days. Today is now {new_today}.",
    }


@router.post("/set-hearts")
def set_hearts(
    payload: DevSetHeartsRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Set the user's hearts (0..5)."""
    target = max(0, min(5, payload.hearts))
    user.hearts = target
    user.hearts_updated_at = clock.now(user)
    db.commit()
    return {"hearts": user.hearts, "message": f"Hearts set to {user.hearts}."}


@router.post("/add-xp")
def add_xp(
    payload: DevAddXPRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add XP directly."""
    xp_service.award_xp(db, user, payload.amount, "bonus")
    xp_service.record_activity(db, user, payload.amount, completed_session=False)
    db.commit()
    return {"total_xp": user.total_xp, "message": f"Added {payload.amount} XP."}


@router.post("/add-gems")
def add_gems(
    payload: DevAddGemsRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add gems directly."""
    new_balance = gem_service.change_gems(db, user, payload.amount, "dev")
    db.commit()
    return {"gems": new_balance, "message": f"Added {payload.amount} gems."}


@router.post("/unlock-all")
def unlock_all_skills(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all skills as completed for testing later units."""
    skills = db.scalars(select(Skill).where(Skill.kind == "skill")).all()
    for s in skills:
        prog = db.scalar(
            select(UserSkillProgress).where(
                UserSkillProgress.user_id == user.id, UserSkillProgress.skill_id == s.id
            )
        )
        if prog is None:
            prog = UserSkillProgress(
                user_id=user.id,
                skill_id=s.id,
                lessons_completed=s.total_levels,
                completed_at=clock.now(user),
            )
            db.add(prog)
        else:
            prog.lessons_completed = s.total_levels
            prog.completed_at = clock.now(user)
    db.commit()
    return {"message": "All skills unlocked and completed."}


@router.post("/reset")
def reset_database():
    """Trigger a clean database re-seed."""
    from app.seed.seed import run_seed
    run_seed(force_reset=True)
    return {"message": "Database reset and re-seeded successfully."}
