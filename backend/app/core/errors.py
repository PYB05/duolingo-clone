"""
Custom exception classes and a unified error-response handler.

Error format (Section 10):
  { "error": { "code": "OUT_OF_HEARTS", "message": "...", "details": {} } }

HTTP status mapping:
  400 — bad request
  403 — forbidden / locked
  404 — not found
  409 — conflict (out of hearts, insufficient gems, already completed)
  422 — validation (handled by FastAPI/Pydantic automatically)
"""

from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Base application error."""

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        details: dict | None = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, resource: str = "Resource", message: str | None = None):
        super().__init__(
            code="NOT_FOUND",
            message=message or f"{resource} not found.",
            status_code=404,
        )


class LockedError(AppError):
    def __init__(self, message: str = "This content is locked."):
        super().__init__(code="LOCKED", message=message, status_code=403)


class OutOfHeartsError(AppError):
    def __init__(self):
        super().__init__(
            code="OUT_OF_HEARTS",
            message="You ran out of hearts!",
            status_code=409,
        )


class InsufficientGemsError(AppError):
    def __init__(self, required: int, available: int):
        super().__init__(
            code="INSUFFICIENT_GEMS",
            message=f"Not enough gems. Need {required}, have {available}.",
            status_code=409,
            details={"required": required, "available": available},
        )


class AlreadyCompletedError(AppError):
    def __init__(self, resource: str = "Attempt"):
        super().__init__(
            code="ALREADY_COMPLETED",
            message=f"{resource} has already been completed.",
            status_code=409,
        )


class DevToolsDisabledError(AppError):
    def __init__(self):
        super().__init__(
            code="DEV_TOOLS_DISABLED",
            message="Developer tools are disabled.",
            status_code=403,
        )


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    """Unified error handler registered on the FastAPI app."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            }
        },
    )
