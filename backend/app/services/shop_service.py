"""
Shop service: purchases of heart refills and streak freezes.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core import clock
from app.core.errors import AppError, InsufficientGemsError, NotFoundError
from app.models.gamification import Purchase, ShopItem
from app.models.user import User
from app.services import gem_service, hearts_service


def get_shop_items(db: Session) -> list[ShopItem]:
    """Return all available shop items."""
    return list(db.scalars(select(ShopItem).where(ShopItem.is_available.is_(True)).order_by(ShopItem.id)))


def purchase_item(db: Session, user: User, item_key: str) -> tuple[ShopItem, int]:
    """
    Process purchase of a shop item.
    Deducts gems and applies the item effect.
    Returns (item, new_gem_balance).
    """
    item = db.scalar(select(ShopItem).where(ShopItem.key == item_key, ShopItem.is_available.is_(True)))
    if item is None:
        raise NotFoundError(f"Shop item '{item_key}'")

    if user.gems < item.price_gems:
        raise InsufficientGemsError(required=item.price_gems, available=user.gems)

    if item_key == "heart_refill":
        # Hearts cannot be refilled if already full (5)
        hearts_service.apply_regen(db, user)
        if user.hearts >= 5:
            raise AppError("HEARTS_ALREADY_FULL", "Your hearts are already full!", 409)
        # Deduct gems
        gem_service.change_gems(db, user, -item.price_gems, "purchase", ref_id=item.id)
        # Refill hearts to 5
        hearts_service.change_hearts(db, user, 5 - user.hearts, "refill")

    elif item_key == "streak_freeze":
        if item.max_owned is not None and user.streak_freezes >= item.max_owned:
            raise AppError(
                "MAX_FREEZES_REACHED",
                f"You already have the maximum number of streak freezes ({item.max_owned})!",
                409,
            )
        # Deduct gems
        gem_service.change_gems(db, user, -item.price_gems, "purchase", ref_id=item.id)
        user.streak_freezes += 1

    else:
        raise AppError("ITEM_UNAVAILABLE", f"Item '{item_key}' cannot be purchased yet.", 400)

    # Record purchase
    purchase = Purchase(
        user_id=user.id,
        shop_item_id=item.id,
        price_paid=item.price_gems,
        created_at=clock.utc_now(),
    )
    db.add(purchase)
    db.flush()

    return item, user.gems
