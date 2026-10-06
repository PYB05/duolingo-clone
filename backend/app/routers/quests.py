"""
Quests router: daily and monthly challenges.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.api import QuestItemSchema, QuestsResponse
from app.services import quest_service

router = APIRouter(prefix="/quests", tags=["quests"])


@router.get("", response_model=QuestsResponse)
def get_quests(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch current daily and monthly quest progress."""
    views, _ = quest_service.refresh(db, user)
    db.commit()

    daily_out: list[QuestItemSchema] = []
    monthly_out: list[QuestItemSchema] = []

    for v in views:
        item = QuestItemSchema(
            id=v.definition.id,
            key=v.definition.key,
            title=v.definition.title,
            metric=v.definition.metric,
            target=v.definition.target,
            progress=v.row.progress,
            reward_gems=v.definition.reward_gems,
            period=v.definition.period,
            is_completed=(v.row.completed_at is not None),
            is_claimed=(v.row.claimed_at is not None),
        )
        if v.definition.period == "daily":
            daily_out.append(item)
        else:
            monthly_out.append(item)

    return QuestsResponse(daily_quests=daily_out, monthly_quests=monthly_out)


@router.post("/{quest_id}/claim", response_model=QuestItemSchema)
def claim_quest(quest_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Claim the gem reward for a completed quest."""
    view = quest_service.claim(db, user, quest_id)
    db.commit()

    return QuestItemSchema(
        id=view.definition.id,
        key=view.definition.key,
        title=view.definition.title,
        metric=view.definition.metric,
        target=view.definition.target,
        progress=view.row.progress,
        reward_gems=view.definition.reward_gems,
        period=view.definition.period,
        is_completed=(view.row.completed_at is not None),
        is_claimed=(view.row.claimed_at is not None),
    )
