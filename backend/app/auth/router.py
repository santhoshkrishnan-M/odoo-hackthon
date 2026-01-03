"""
Authentication router.
Handles user login, registration, and token management.
"""
from fastapi import APIRouter, HTTPException, status
from app.auth import schemas

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={404: {"description": "Not found"}},
)


@router.post("/login", response_model=schemas.TokenResponse)
async def login(request: schemas.TokenRequest) -> dict:
    """
    User login endpoint.
    Returns JWT token for authenticated user.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.post("/register", response_model=schemas.AuthResponse)
async def register(request: schemas.RegisterRequest) -> dict:
    """
    User registration endpoint.
    Creates new user account.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.post("/refresh", response_model=schemas.TokenResponse)
async def refresh_token() -> dict:
    """
    Refresh access token endpoint.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.post("/logout", response_model=schemas.AuthResponse)
async def logout() -> dict:
    """
    User logout endpoint.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }
