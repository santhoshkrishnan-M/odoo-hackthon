"""
Pydantic schemas for authentication endpoints.
"""
from pydantic import BaseModel, EmailStr


class TokenRequest(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class RegisterRequest(BaseModel):
    """User registration request schema."""
    email: EmailStr
    username: str
    password: str
    full_name: str | None = None


class AuthResponse(BaseModel):
    """Generic authentication response."""
    message: str
    status: str
