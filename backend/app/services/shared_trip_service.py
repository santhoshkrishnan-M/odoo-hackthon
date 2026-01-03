from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import secrets
from app.repositories.shared_trip_repository import SharedTripRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.shared_trip import SharedTripCreate
from app.models.shared_trip import SharedTrip
from app.models.trip import Trip


class SharedTripService:
    def __init__(self, db: AsyncSession):
        self.repository = SharedTripRepository(db)
        self.trip_repository = TripRepository(db)
    
    def generate_share_token(self) -> str:
        return secrets.token_urlsafe(32)
    
    async def create_shared_trip(self, user_id: str, shared_trip_data: SharedTripCreate) -> SharedTrip:
        trip = await self.trip_repository.get_by_id(shared_trip_data.trip_id)
        if not trip or trip.user_id != user_id:
            raise ValueError("Trip not found or access denied")
        
        share_token = self.generate_share_token()
        
        return await self.repository.create(
            trip_id=shared_trip_data.trip_id,
            user_id=user_id,
            share_token=share_token,
            expires_at=shared_trip_data.expires_at
        )
    
    async def get_shared_trip_by_token(self, share_token: str) -> Optional[tuple[SharedTrip, Trip]]:
        shared_trip = await self.repository.get_by_token(share_token)
        if not shared_trip:
            return None
        
        if shared_trip.expires_at and shared_trip.expires_at < datetime.utcnow():
            return None
        
        trip = await self.trip_repository.get_by_id(shared_trip.trip_id)
        return (shared_trip, trip) if trip else None
    
    async def revoke_shared_trip(self, shared_trip_id: str, user_id: str) -> bool:
        shared_trip = await self.repository.get_by_id(shared_trip_id)
        if not shared_trip:
            return False
        
        trip = await self.trip_repository.get_by_id(shared_trip.trip_id)
        if not trip or trip.user_id != user_id:
            return False
        
        await self.repository.delete(shared_trip)
        return True
