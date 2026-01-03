"""
Admin router.
Administrative endpoints for system management.
"""
from fastapi import APIRouter
from typing import List

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    responses={404: {"description": "Not found"}},
)


@router.get("/users")
async def list_all_users() -> dict:
    """
    List all users (admin only).
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.get("/trips")
async def list_all_trips() -> dict:
    """
    List all trips (admin only).
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.get("/stats")
async def get_system_stats() -> dict:
    """
    Get system statistics (admin only).
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }
