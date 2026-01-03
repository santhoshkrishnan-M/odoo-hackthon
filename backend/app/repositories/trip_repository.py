from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from app.models.trip import Trip


class TripRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, user_id: str, title: str, description: Optional[str], 
                     start_date, end_date) -> Trip:
        trip = Trip(
            user_id=user_id,
            title=title,
            description=description,
            start_date=start_date,
            end_date=end_date
        )
        self.db.add(trip)
        await self.db.commit()
        await self.db.refresh(trip)
        return trip
    
    async def get_by_id(self, trip_id: str) -> Optional[Trip]:
        result = await self.db.execute(
            select(Trip).where(Trip.id == trip_id, Trip.is_deleted == False)
        )
        return result.scalar_one_or_none()
    
    async def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Trip]:
        result = await self.db.execute(
            select(Trip)
            .where(Trip.user_id == user_id, Trip.is_deleted == False)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def update(self, trip: Trip) -> Trip:
        await self.db.commit()
        await self.db.refresh(trip)
        return trip
    
    async def soft_delete(self, trip: Trip) -> None:
        trip.is_deleted = True
        await self.db.commit()
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Trip]:
        result = await self.db.execute(
            select(Trip).where(Trip.is_deleted == False).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
