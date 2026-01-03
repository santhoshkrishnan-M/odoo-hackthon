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
    duration_days: int = 0
    total_budget: float = 0.0
    total_spent: float = 0.0
    remaining_budget: float = 0.0
    itinerary_days_count: int = 0
    cities_count: int = 0
    activities_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        data = {
            'id': obj.id,
            'user_id': obj.user_id,
            'title': obj.title,
            'description': obj.description,
            'start_date': obj.start_date,
            'end_date': obj.end_date,
            'duration_days': getattr(obj, 'duration_days', 0),
            'total_budget': getattr(obj, 'total_budget', 0.0),
            'total_spent': getattr(obj, 'total_spent', 0.0),
            'remaining_budget': getattr(obj, 'remaining_budget', 0.0),
            'itinerary_days_count': getattr(obj, 'itinerary_days_count', 0),
            'cities_count': getattr(obj, 'cities_count', 0),
            'activities_count': getattr(obj, 'activities_count', 0),
            'created_at': obj.created_at,
            'updated_at': obj.updated_at
        }
        return cls(**data)
