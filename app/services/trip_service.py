from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime
from app.repositories.trip_repository import TripRepository
from app.repositories.budget_repository import BudgetRepository
from app.repositories.itinerary_repository import ItineraryRepository
from app.schemas.trip import TripCreate, TripUpdate
from app.models.trip import Trip
from app.models.itinerary_day import ItineraryDay
from app.models.itinerary_item import ItineraryItem
from app.models.activity import Activity
from app.models.city import City


class TripService:
    def __init__(self, db: AsyncSession):
        self.repository = TripRepository(db)
        self.budget_repository = BudgetRepository(db)
        self.itinerary_repository = ItineraryRepository(db)
        self.db = db
    
    async def create_trip(self, user_id: str, trip_data: TripCreate) -> Trip:
        if trip_data.end_date <= trip_data.start_date:
            raise ValueError("End date must be after start date")
        
        return await self.repository.create(
            user_id=user_id,
            title=trip_data.title,
            description=trip_data.description,
            start_date=trip_data.start_date,
            end_date=trip_data.end_date
        )
    
    async def get_trip_by_id(self, trip_id: str) -> Optional[Trip]:
        trip = await self.repository.get_by_id(trip_id)
        if trip:
            await self._enrich_trip_with_computed_data(trip)
        return trip
    
    async def get_user_trips(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Trip]:
        trips = await self.repository.get_by_user(user_id, skip, limit)
        for trip in trips:
            await self._enrich_trip_with_computed_data(trip)
        return trips
    
    async def update_trip(self, trip_id: str, user_id: str, trip_data: TripUpdate) -> Optional[Trip]:
        trip = await self.repository.get_by_id(trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        if trip_data.title is not None:
            trip.title = trip_data.title
        if trip_data.description is not None:
            trip.description = trip_data.description
        if trip_data.start_date is not None:
            trip.start_date = trip_data.start_date
        if trip_data.end_date is not None:
            trip.end_date = trip_data.end_date
        
        if trip.end_date <= trip.start_date:
            raise ValueError("End date must be after start date")
        
        return await self.repository.update(trip)
    
    async def delete_trip(self, trip_id: str, user_id: str) -> bool:
        trip = await self.repository.get_by_id(trip_id)
        if not trip or trip.user_id != user_id:
            return False
        await self.repository.soft_delete(trip)
        return True
    
    async def verify_trip_ownership(self, trip_id: str, user_id: str) -> bool:
        trip = await self.repository.get_by_id(trip_id)
        return trip is not None and trip.user_id == user_id
    
    async def get_all_trips(self, skip: int = 0, limit: int = 100) -> List[Trip]:
        trips = await self.repository.get_all(skip, limit)
        for trip in trips:
            await self._enrich_trip_with_computed_data(trip)
        return trips
    
    async def _enrich_trip_with_computed_data(self, trip: Trip) -> None:
        duration_days = (trip.end_date - trip.start_date).days + 1
        trip.duration_days = duration_days
        
        budget = await self.budget_repository.get_by_trip(trip.id)
        if budget:
            spent_total = await self._compute_trip_spent(trip.id)
            trip.total_budget = budget.total_budget
            trip.total_spent = spent_total
            trip.remaining_budget = budget.total_budget - spent_total
        else:
            trip.total_budget = 0.0
            trip.total_spent = 0.0
            trip.remaining_budget = 0.0
        
        days = await self.itinerary_repository.get_days_by_trip(trip.id)
        trip.itinerary_days_count = len(days)
        
        cities_result = await self.db.execute(
            select(func.count(func.distinct(ItineraryDay.city_id)))
            .where(ItineraryDay.trip_id == trip.id)
        )
        trip.cities_count = cities_result.scalar() or 0
        
        activities_result = await self.db.execute(
            select(func.count(ItineraryItem.id))
            .join(ItineraryDay, ItineraryItem.itinerary_day_id == ItineraryDay.id)
            .where(
                ItineraryDay.trip_id == trip.id,
                ItineraryItem.activity_id.isnot(None)
            )
        )
        trip.activities_count = activities_result.scalar() or 0
    
    async def _compute_trip_spent(self, trip_id: str) -> float:
        days = await self.itinerary_repository.get_days_by_trip(trip_id)
        total_spent = 0.0
        
        for day in days:
            items = await self.itinerary_repository.get_items_by_day(day.id)
            for item in items:
                if item.activity_id:
                    result = await self.db.execute(
                        select(Activity).where(Activity.id == item.activity_id)
                    )
                    activity = result.scalar_one_or_none()
                    if activity and activity.estimated_cost:
                        total_spent += activity.estimated_cost
        
        return total_spent
