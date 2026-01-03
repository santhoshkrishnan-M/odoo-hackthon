from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from app.repositories.trip_repository import TripRepository
from app.schemas.trip import TripCreate, TripUpdate
from app.models.trip import Trip


class TripService:
    def __init__(self, db: AsyncSession):
        self.repository = TripRepository(db)
    
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
        return await self.repository.get_by_id(trip_id)
    
    async def get_user_trips(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Trip]:
        return await self.repository.get_by_user(user_id, skip, limit)
    
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
        return await self.repository.get_all(skip, limit)
