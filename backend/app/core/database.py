"""
Database engine and session setup for SQLite via SQLAlchemy 2.x.

Key decisions:
  - PRAGMA foreign_keys=ON is enforced on every connection via an event listener.
  - WAL journal mode is set for better concurrent-read performance.
  - SessionLocal is a factory; use get_db() as a FastAPI dependency.
"""

import os
from collections.abc import Generator

from sqlalchemy import event, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


# Ensure the data directory exists for SQLite
db_path = settings.DATABASE_URL.replace("sqlite:///", "")
db_dir = os.path.dirname(db_path)
if db_dir:
    os.makedirs(db_dir, exist_ok=True)

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},  # required for SQLite + threads
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


# ---------------------------------------------------------------------------
# SQLite PRAGMAs — enforce foreign keys and enable WAL on every connection
# ---------------------------------------------------------------------------
@event.listens_for(Engine, "connect")
def _set_sqlite_pragmas(dbapi_conn, connection_record):  # noqa: ANN001
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.close()


def create_tables() -> None:
    """Create all tables (idempotent — safe to call on every startup)."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session and auto-closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
