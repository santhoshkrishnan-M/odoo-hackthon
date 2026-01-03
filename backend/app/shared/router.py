"""
Shared router.
Common endpoints accessible to all users.
"""
from fastapi import APIRouter

router = APIRouter(
    prefix="/shared",
    tags=["Shared"],
)


@router.get("/health")
async def health_check() -> dict:
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "message": "GlobeTrotter API is running"
    }
