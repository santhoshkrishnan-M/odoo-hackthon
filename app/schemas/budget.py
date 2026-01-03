from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BudgetCreate(BaseModel):
    trip_id: str
    total_budget: float = Field(..., gt=0)
    accommodation: float = Field(default=0.0, ge=0)
    transportation: float = Field(default=0.0, ge=0)
    food: float = Field(default=0.0, ge=0)
    activities: float = Field(default=0.0, ge=0)
    shopping: float = Field(default=0.0, ge=0)
    other: float = Field(default=0.0, ge=0)


class BudgetUpdate(BaseModel):
    total_budget: Optional[float] = Field(None, gt=0)
    accommodation: Optional[float] = Field(None, ge=0)
    transportation: Optional[float] = Field(None, ge=0)
    food: Optional[float] = Field(None, ge=0)
    activities: Optional[float] = Field(None, ge=0)
    shopping: Optional[float] = Field(None, ge=0)
    other: Optional[float] = Field(None, ge=0)


class BudgetResponse(BaseModel):
    id: str
    trip_id: str
    total_budget: float
    accommodation: float
    transportation: float
    food: float
    activities: float
    shopping: float
    other: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
