from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.budget_repository import BudgetRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.models.budget import Budget


class BudgetService:
    def __init__(self, db: AsyncSession):
        self.repository = BudgetRepository(db)
        self.trip_repository = TripRepository(db)
    
    async def create_budget(self, user_id: str, budget_data: BudgetCreate) -> Budget:
        trip = await self.trip_repository.get_by_id(budget_data.trip_id)
        if not trip or trip.user_id != user_id:
            raise ValueError("Trip not found or access denied")
        
        existing_budget = await self.repository.get_by_trip(budget_data.trip_id)
        if existing_budget:
            raise ValueError("Budget already exists for this trip")
        
        return await self.repository.create(
            trip_id=budget_data.trip_id,
            total_budget=budget_data.total_budget,
            accommodation=budget_data.accommodation,
            transportation=budget_data.transportation,
            food=budget_data.food,
            activities=budget_data.activities,
            shopping=budget_data.shopping,
            other=budget_data.other
        )
    
    async def get_budget_by_trip(self, trip_id: str, user_id: str) -> Optional[Budget]:
        trip = await self.trip_repository.get_by_id(trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        return await self.repository.get_by_trip(trip_id)
    
    async def update_budget(self, budget_id: str, user_id: str, budget_data: BudgetUpdate) -> Optional[Budget]:
        budget = await self.repository.get_by_id(budget_id)
        if not budget:
            return None
        
        trip = await self.trip_repository.get_by_id(budget.trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        if budget_data.total_budget is not None:
            budget.total_budget = budget_data.total_budget
        if budget_data.accommodation is not None:
            budget.accommodation = budget_data.accommodation
        if budget_data.transportation is not None:
            budget.transportation = budget_data.transportation
        if budget_data.food is not None:
            budget.food = budget_data.food
        if budget_data.activities is not None:
            budget.activities = budget_data.activities
        if budget_data.shopping is not None:
            budget.shopping = budget_data.shopping
        if budget_data.other is not None:
            budget.other = budget_data.other
        
        return await self.repository.update(budget)
    
    async def delete_budget(self, budget_id: str, user_id: str) -> bool:
        budget = await self.repository.get_by_id(budget_id)
        if not budget:
            return False
        
        trip = await self.trip_repository.get_by_id(budget.trip_id)
        if not trip or trip.user_id != user_id:
            return False
        
        await self.repository.delete(budget)
        return True
