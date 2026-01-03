from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ItineraryDayCreate(BaseModel):
    trip_id: str
    city_id: str
    day_number: int = Field(..., ge=1)
    date: datetime
    notes: Optional[str] = None


class ItineraryDayUpdate(BaseModel):
    city_id: Optional[str] = None
    date: Optional[datetime] = None
    notes: Optional[str] = None


class ItineraryDayResponse(BaseModel):
    id: str
    trip_id: str
    city_id: str
    day_number: int
    date: datetime
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ItineraryItemCreate(BaseModel):
    itinerary_day_id: str
    activity_id: Optional[str] = None
    order_index: int = Field(..., ge=0)
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    custom_title: Optional[str] = None
    custom_notes: Optional[str] = None


class ItineraryItemUpdate(BaseModel):
    activity_id: Optional[str] = None
    order_index: Optional[int] = Field(None, ge=0)
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    custom_title: Optional[str] = None
    custom_notes: Optional[str] = None


class ItineraryItemResponse(BaseModel):
    id: str
    itinerary_day_id: str
    activity_id: Optional[str]
    order_index: int
    start_time: Optional[str]
    end_time: Optional[str]
    custom_title: Optional[str]
    custom_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
