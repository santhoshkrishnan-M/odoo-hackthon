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
    spent_accommodation: float = 0.0
    spent_transportation: float = 0.0
    spent_food: float = 0.0
    spent_activities: float = 0.0
    spent_shopping: float = 0.0
    spent_other: float = 0.0
    total_spent: float = 0.0
    remaining_budget: float = 0.0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        data = {
            'id': obj.id,
            'trip_id': obj.trip_id,
            'total_budget': obj.total_budget,
            'accommodation': obj.accommodation,
            'transportation': obj.transportation,
            'food': obj.food,
            'activities': obj.activities,
            'shopping': obj.shopping,
            'other': obj.other,
            'spent_accommodation': getattr(obj, 'spent_accommodation', 0.0),
            'spent_transportation': getattr(obj, 'spent_transportation', 0.0),
            'spent_food': getattr(obj, 'spent_food', 0.0),
            'spent_activities': getattr(obj, 'spent_activities', 0.0),
            'spent_shopping': getattr(obj, 'spent_shopping', 0.0),
            'spent_other': getattr(obj, 'spent_other', 0.0),
            'total_spent': getattr(obj, 'total_spent', 0.0),
            'remaining_budget': obj.total_budget - getattr(obj, 'total_spent', 0.0),
            'created_at': obj.created_at,
            'updated_at': obj.updated_at
        }
        return cls(**data)
