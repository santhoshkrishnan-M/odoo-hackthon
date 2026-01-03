from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from datetime import datetime
from app.models.shared_trip import SharedTrip


class SharedTripRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, trip_id: str, user_id: str, share_token: str,
                     expires_at: Optional[datetime] = None) -> SharedTrip:
        shared_trip = SharedTrip(
            trip_id=trip_id,
            user_id=user_id,
            share_token=share_token,
            expires_at=expires_at
        )
        self.db.add(shared_trip)
        await self.db.commit()
        await self.db.refresh(shared_trip)
        return shared_trip
    
    async def get_by_id(self, shared_trip_id: str) -> Optional[SharedTrip]:
        result = await self.db.execute(select(SharedTrip).where(SharedTrip.id == shared_trip_id))
        return result.scalar_one_or_none()
    
    async def get_by_token(self, share_token: str) -> Optional[SharedTrip]:
        result = await self.db.execute(select(SharedTrip).where(SharedTrip.share_token == share_token))
        return result.scalar_one_or_none()
    
    async def get_by_trip(self, trip_id: str) -> List[SharedTrip]:
        result = await self.db.execute(select(SharedTrip).where(SharedTrip.trip_id == trip_id))
        return list(result.scalars().all())
    
    async def delete(self, shared_trip: SharedTrip) -> None:
        await self.db.delete(shared_trip)
        await self.db.commit()
