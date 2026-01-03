from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ActivityCreate(BaseModel):
    city_id: str
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=50)
    estimated_cost: Optional[float] = Field(None, ge=0)
    estimated_duration: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None


class ActivityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    estimated_cost: Optional[float] = Field(None, ge=0)
    estimated_duration: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None


class ActivityResponse(BaseModel):
    id: str
    city_id: str
    name: str
    description: Optional[str]
    category: str
    estimated_cost: Optional[float]
    estimated_duration: Optional[int]
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
