from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TripCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime


class TripUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class TripResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
