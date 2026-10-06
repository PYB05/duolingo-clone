"""
Leaderboard and leagues router.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.api import LeaderboardResponse, StandingSchema, StandingUserSchema
from app.services import league_service

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch current weekly league group standings with live bot simulation and zone cutoffs."""
    membership, ranking = league_service.standings(db, user)
    tier_info = league_service.tier_info(db, membership.group.tier)
    last_res = league_service.last_result(db, user)
    w_end = league_service.week_end(user, membership.group.week_start)

    # Find learner's rank
    learner_rank = next((s.rank for s in ranking if s.user.id == user.id), 1)

    standings_out: list[StandingSchema] = []
    for s in ranking:
        standings_out.append(
            StandingSchema(
                rank=s.rank,
                user=StandingUserSchema(
                    id=s.user.id,
                    display_name=s.user.display_name,
                    avatar_color=s.user.avatar_color,
                    is_current_user=(s.user.id == user.id),
                ),
                weekly_xp=s.weekly_xp,
            )
        )

    last_res_out = None
    if last_res:
        last_res_out = {
            "tier": last_res.group.tier,
            "final_rank": last_res.final_rank,
            "result": last_res.result,
        }
        # Mark as seen
        last_res.result_seen = True
        db.commit()

    db.commit()

    return LeaderboardResponse(
        tier=membership.group.tier,
        tier_name=tier_info.name,
        tier_color=tier_info.color_hex,
        week_ends_at=w_end.isoformat(),
        promotion_zone=league_service.PROMOTE_TOP,
        demotion_zone=len(ranking) - league_service.DEMOTE_BOTTOM + 1,
        user_rank=learner_rank,
        user_weekly_xp=membership.weekly_xp,
        standings=standings_out,
        last_week_result=last_res_out,
    )
