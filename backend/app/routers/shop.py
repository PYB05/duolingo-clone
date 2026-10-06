"""
Shop router: currency exchange for hearts and streak freezes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.api import PurchaseResponse, ShopItemSchema, ShopResponse
from app.services import shop_service

router = APIRouter(prefix="/shop", tags=["shop"])


@router.get("", response_model=ShopResponse)
def get_shop(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch shop items with pricing and user inventory counts."""
    items = shop_service.get_shop_items(db)
    items_out: list[ShopItemSchema] = []

    for item in items:
        owned = None
        if item.key == "streak_freeze":
            owned = user.streak_freezes
        elif item.key == "heart_refill":
            owned = user.hearts

        items_out.append(
            ShopItemSchema(
                id=item.id,
                key=item.key,
                name=item.name,
                description=item.description,
                price_gems=item.price_gems,
                max_owned=item.max_owned,
                owned_count=owned,
            )
        )

    return ShopResponse(gems=user.gems, items=items_out)


@router.post("/{item_key}/purchase", response_model=PurchaseResponse)
def purchase_item(
    item_key: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Purchase a shop item."""
    item, new_balance = shop_service.purchase_item(db, user, item_key)
    db.commit()

    return PurchaseResponse(
        item_key=item.key,
        price_paid=item.price_gems,
        new_gem_balance=new_balance,
        message=f"Successfully purchased {item.name}!",
    )
