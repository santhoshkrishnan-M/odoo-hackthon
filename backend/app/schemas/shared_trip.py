from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SharedTripCreate(BaseModel):
    trip_id: str
    expires_at: Optional[datetime] = None


class SharedTripResponse(BaseModel):
    id: str
    trip_id: str
    user_id: str
    share_token: str
    expires_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True
