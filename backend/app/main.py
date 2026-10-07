"""
FastAPI application factory.

Responsibilities:
  - Create the FastAPI app
  - Configure CORS
  - Register the unified error handler
  - Mount all routers under /api/v1
  - On startup: create tables and optionally seed the database
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_tables
from app.core.errors import AppError, app_error_handler
from app.routers import (
    achievements,
    course,
    dev,
    health,
    leaderboard,
    lessons,
    me,
    practice,
    profile,
    quests,
    shop,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup and shutdown logic."""
    # --- Startup ---
    create_tables()

    if settings.SEED_ON_STARTUP:
        from app.seed.seed import run_seed
        run_seed()

    yield
    # --- Shutdown ---


def create_app() -> FastAPI:
    """Build and return the configured FastAPI application."""
    app = FastAPI(
        title="Duolingo Clone API",
        description="Backend API for the Duolingo web app clone — educational project.",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # --- CORS ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_origin_regex=r".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Error handler ---
    app.add_exception_handler(AppError, app_error_handler)

    # --- Routers ---
    prefix = "/api/v1"
    app.include_router(health.router, prefix=prefix)
    app.include_router(me.router, prefix=prefix)
    app.include_router(course.router, prefix=prefix)
    app.include_router(lessons.router, prefix=prefix)
    app.include_router(practice.router, prefix=prefix)
    app.include_router(leaderboard.router, prefix=prefix)
    app.include_router(quests.router, prefix=prefix)
    app.include_router(achievements.router, prefix=prefix)
    app.include_router(shop.router, prefix=prefix)
    app.include_router(profile.router, prefix=prefix)
    app.include_router(dev.router, prefix=prefix)

    return app


# The app instance Uvicorn will serve.
app = create_app()
