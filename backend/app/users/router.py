"""
Users router.
Handles user profile and account management.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from app.users import schemas
from app.core.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "Not found"}},
)


@router.get("/me", response_model=schemas.UserResponse)
async def get_current_user() -> dict:
    """
    Get current authenticated user profile.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.put("/me", response_model=schemas.UserResponse)
async def update_current_user(request: schemas.UserUpdate) -> dict:
    """
    Update current user profile.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.get("/{user_id}", response_model=schemas.UserDetailResponse)
async def get_user(user_id: int) -> dict:
    """
    Get user by ID.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.delete("/{user_id}", response_model=dict)
async def delete_user(user_id: int) -> dict:
    """
    Delete user account.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }
