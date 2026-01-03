from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.itinerary_repository import ItineraryRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.city_repository import CityRepository
from app.repositories.activity_repository import ActivityRepository
from app.schemas.itinerary import ItineraryDayCreate, ItineraryDayUpdate, ItineraryItemCreate, ItineraryItemUpdate
from app.models.itinerary_day import ItineraryDay
from app.models.itinerary_item import ItineraryItem


class ItineraryService:
    def __init__(self, db: AsyncSession):
        self.repository = ItineraryRepository(db)
        self.trip_repository = TripRepository(db)
        self.city_repository = CityRepository(db)
        self.activity_repository = ActivityRepository(db)
    
    async def create_day(self, user_id: str, day_data: ItineraryDayCreate) -> ItineraryDay:
        trip = await self.trip_repository.get_by_id(day_data.trip_id)
        if not trip or trip.user_id != user_id:
            raise ValueError("Trip not found or access denied")
        
        city = await self.city_repository.get_by_id(day_data.city_id)
        if not city:
            raise ValueError("City not found")
        
        return await self.repository.create_day(
            trip_id=day_data.trip_id,
            city_id=day_data.city_id,
            day_number=day_data.day_number,
            date=day_data.date,
            notes=day_data.notes
        )
    
    async def get_day_by_id(self, day_id: str, user_id: str) -> Optional[ItineraryDay]:
        day = await self.repository.get_day_by_id(day_id)
        if not day:
            return None
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        return day
    
    async def get_days_by_trip(self, trip_id: str, user_id: str) -> List[ItineraryDay]:
        trip = await self.trip_repository.get_by_id(trip_id)
        if not trip or trip.user_id != user_id:
            raise ValueError("Trip not found or access denied")
        
        return await self.repository.get_days_by_trip(trip_id)
    
    async def update_day(self, day_id: str, user_id: str, day_data: ItineraryDayUpdate) -> Optional[ItineraryDay]:
        day = await self.repository.get_day_by_id(day_id)
        if not day:
            return None
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        if day_data.city_id is not None:
            city = await self.city_repository.get_by_id(day_data.city_id)
            if not city:
                raise ValueError("City not found")
            day.city_id = day_data.city_id
        
        if day_data.date is not None:
            day.date = day_data.date
        if day_data.notes is not None:
            day.notes = day_data.notes
        
        return await self.repository.update_day(day)
    
    async def delete_day(self, day_id: str, user_id: str) -> bool:
        day = await self.repository.get_day_by_id(day_id)
        if not day:
            return False
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            return False
        
        await self.repository.delete_day(day)
        return True
    
    async def create_item(self, user_id: str, item_data: ItineraryItemCreate) -> ItineraryItem:
        day = await self.repository.get_day_by_id(item_data.itinerary_day_id)
        if not day:
            raise ValueError("Itinerary day not found")
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            raise ValueError("Access denied")
        
        if item_data.activity_id:
            activity = await self.activity_repository.get_by_id(item_data.activity_id)
            if not activity:
                raise ValueError("Activity not found")
        
        return await self.repository.create_item(
            itinerary_day_id=item_data.itinerary_day_id,
            activity_id=item_data.activity_id,
            order_index=item_data.order_index,
            start_time=item_data.start_time,
            end_time=item_data.end_time,
            custom_title=item_data.custom_title,
            custom_notes=item_data.custom_notes
        )
    
    async def get_item_by_id(self, item_id: str, user_id: str) -> Optional[ItineraryItem]:
        item = await self.repository.get_item_by_id(item_id)
        if not item:
            return None
        
        day = await self.repository.get_day_by_id(item.itinerary_day_id)
        if not day:
            return None
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        return item
    
    async def get_items_by_day(self, day_id: str, user_id: str) -> List[ItineraryItem]:
        day = await self.repository.get_day_by_id(day_id)
        if not day:
            raise ValueError("Itinerary day not found")
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            raise ValueError("Access denied")
        
        return await self.repository.get_items_by_day(day_id)
    
    async def update_item(self, item_id: str, user_id: str, item_data: ItineraryItemUpdate) -> Optional[ItineraryItem]:
        item = await self.repository.get_item_by_id(item_id)
        if not item:
            return None
        
        day = await self.repository.get_day_by_id(item.itinerary_day_id)
        if not day:
            return None
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            return None
        
        if item_data.activity_id is not None:
            if item_data.activity_id:
                activity = await self.activity_repository.get_by_id(item_data.activity_id)
                if not activity:
                    raise ValueError("Activity not found")
            item.activity_id = item_data.activity_id
        
        if item_data.order_index is not None:
            item.order_index = item_data.order_index
        if item_data.start_time is not None:
            item.start_time = item_data.start_time
        if item_data.end_time is not None:
            item.end_time = item_data.end_time
        if item_data.custom_title is not None:
            item.custom_title = item_data.custom_title
        if item_data.custom_notes is not None:
            item.custom_notes = item_data.custom_notes
        
        return await self.repository.update_item(item)
    
    async def delete_item(self, item_id: str, user_id: str) -> bool:
        item = await self.repository.get_item_by_id(item_id)
        if not item:
            return False
        
        day = await self.repository.get_day_by_id(item.itinerary_day_id)
        if not day:
            return False
        
        trip = await self.trip_repository.get_by_id(day.trip_id)
        if not trip or trip.user_id != user_id:
            return False
        
        await self.repository.delete_item(item)
        return True
