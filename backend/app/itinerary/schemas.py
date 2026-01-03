"""
Itinerary schemas for request/response validation.
"""
from pydantic import BaseModel
from datetime import datetime


class ItineraryBase(BaseModel):
    """Base itinerary schema."""
    day_number: int
    activity: str | None = None
    location: str | None = None


class ItineraryCreate(ItineraryBase):
    """Itinerary creation schema."""
    trip_id: int


class ItineraryUpdate(BaseModel):
    """Itinerary update schema."""
    day_number: int | None = None
    activity: str | None = None
    location: str | None = None


class ItineraryResponse(ItineraryBase):
    """Itinerary response schema."""
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
