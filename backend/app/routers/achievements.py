"""
Achievements router.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.gamification import AchievementDefinition, UserAchievement
from app.models.user import User
from app.schemas.api import AchievementItemSchema, AchievementsResponse, AchievementTierSchema
from app.services import achievement_service

router = APIRouter(prefix="/achievements", tags=["achievements"])


@router.get("", response_model=AchievementsResponse)
def get_achievements(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch all achievements with user's tier progression and tier details."""
    achievement_service.evaluate(db, user, grant_rewards=False)
    db.commit()

    definitions = db.scalars(
        select(AchievementDefinition)
        .options(selectinload(AchievementDefinition.tiers))
        .order_by(AchievementDefinition.id)
    ).all()

    user_ach_map = {
        ua.achievement_id: ua
        for ua in db.scalars(select(UserAchievement).where(UserAchievement.user_id == user.id))
    }

    out: list[AchievementItemSchema] = []
    for defn in definitions:
        u_record = user_ach_map.get(defn.id)
        c_val = u_record.progress_value if u_record else 0
        c_tier = u_record.tier_unlocked if u_record else 0

        # Find next threshold
        next_t = next((t.threshold for t in defn.tiers if t.tier_number == c_tier + 1), None)

        tiers_out = [
            AchievementTierSchema(
                tier_number=t.tier_number,
                threshold=t.threshold,
                reward_gems=t.reward_gems,
                is_unlocked=(c_tier >= t.tier_number),
            )
            for t in defn.tiers
        ]

        out.append(
            AchievementItemSchema(
                id=defn.id,
                key=defn.key,
                title=defn.title,
                description=defn.description,
                icon_key=defn.icon_key,
                color_hex=defn.color_hex,
                current_value=c_val,
                current_tier=c_tier,
                max_tier=len(defn.tiers),
                next_threshold=next_t,
                tiers=tiers_out,
            )
        )

    return AchievementsResponse(achievements=out)
