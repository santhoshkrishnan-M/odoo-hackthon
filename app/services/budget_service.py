from typing import Optional, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.budget_repository import BudgetRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.itinerary_repository import ItineraryRepository
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.models.budget import Budget
from app.models.itinerary_item import ItineraryItem
from app.models.activity import Activity


class BudgetService:
    def __init__(self, db: AsyncSession):
        self.repository = BudgetRepository(db)
        self.trip_repository = TripRepository(db)
        self.itinerary_repository = ItineraryRepository(db)
        self.db = db
    
    async def create_budget(self, user_id: str, budget_data: BudgetCreate) -> Budget:
        trip = await self.trip_repository.get_by_id(budget_data.trip_id)
        if not trip or trip.user_id != user_id:
            raise ValueError("Trip not found or access denied")
        
        existing_budget = await self.repository.get_by_trip(budget_data.trip_id)
        if existing_budget:
            raise ValueError("Budget already exists for this trip")
        
        budget = await self.repository.create(
            trip_id=budget_data.trip_id,
            total_budget=budget_data.total_budget,
            accommodation=budget_data.accommodation,
            transportation=budget_data.transportation,
            food=budget_data.food,
            activities=budget_data.activities,
            shopping=budget_data.shopping,
            other=budget_data.other
        )
        await self._compute_spent_amounts(budget)
        return budget
    
    async def get_budget_by_trip(self, trip_id: str, user_id: str) -> Optional[Budget]:
        trip = await self.trip_repository.get_by_id(trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        budget = await self.repository.get_by_trip(trip_id)
        if budget:
            await self._compute_spent_amounts(budget)
        return budget
    
    async def _compute_spent_amounts(self, budget: Budget) -> None:
        days = await self.itinerary_repository.get_days_by_trip(budget.trip_id)
        
        spent_by_category = {
            'accommodation': 0.0,
            'transportation': 0.0,
            'food': 0.0,
            'activities': 0.0,
            'shopping': 0.0,
            'other': 0.0
        }
        
        for day in days:
            items = await self.itinerary_repository.get_items_by_day(day.id)
            for item in items:
                if item.activity_id:
                    result = await self.db.execute(
                        select(Activity).where(Activity.id == item.activity_id)
                    )
                    activity = result.scalar_one_or_none()
                    if activity and activity.estimated_cost:
                        category_key = activity.category.lower()
                        if category_key in spent_by_category:
                            spent_by_category[category_key] += activity.estimated_cost
        
        budget.spent_accommodation = spent_by_category['accommodation']
        budget.spent_transportation = spent_by_category['transportation']
        budget.spent_food = spent_by_category['food']
        budget.spent_activities = spent_by_category['activities']
        budget.spent_shopping = spent_by_category['shopping']
        budget.spent_other = spent_by_category['other']
        budget.total_spent = sum(spent_by_category.values())
    
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
        
        updated_budget = await self.repository.update(budget)
        await self._compute_spent_amounts(updated_budget)
        return updated_budget
    
    async def delete_budget(self, budget_id: str, user_id: str) -> bool:
        budget = await self.repository.get_by_id(budget_id)
        if not budget:
            return False
        
        trip = await self.trip_repository.get_by_id(budget.trip_id)
        if not trip or trip.user_id != user_id:
            return False
        
        await self.repository.delete(budget)
        return True
