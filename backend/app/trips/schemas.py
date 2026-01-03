"""
Trip schemas for request/response validation.
"""
from pydantic import BaseModel
from datetime import datetime


class TripBase(BaseModel):
    """Base trip schema."""
    title: str
    description: str | None = None
    destination: str
    start_date: datetime | None = None
    end_date: datetime | None = None


class TripCreate(TripBase):
    """Trip creation schema."""
    pass


class TripUpdate(BaseModel):
    """Trip update schema."""
    title: str | None = None
    description: str | None = None
    destination: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class TripResponse(TripBase):
    """Trip response schema."""
    id: int
    creator_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TripDetailResponse(TripResponse):
    """Detailed trip response."""
    pass
