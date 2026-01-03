from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from app.models.itinerary_day import ItineraryDay
from app.models.itinerary_item import ItineraryItem


class ItineraryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_day(self, trip_id: str, city_id: str, day_number: int,
                         date, notes: Optional[str] = None) -> ItineraryDay:
        day = ItineraryDay(
            trip_id=trip_id,
            city_id=city_id,
            day_number=day_number,
            date=date,
            notes=notes
        )
        self.db.add(day)
        await self.db.commit()
        await self.db.refresh(day)
        return day
    
    async def get_day_by_id(self, day_id: str) -> Optional[ItineraryDay]:
        result = await self.db.execute(select(ItineraryDay).where(ItineraryDay.id == day_id))
        return result.scalar_one_or_none()
    
    async def get_days_by_trip(self, trip_id: str) -> List[ItineraryDay]:
        result = await self.db.execute(
            select(ItineraryDay).where(ItineraryDay.trip_id == trip_id).order_by(ItineraryDay.day_number)
        )
        return list(result.scalars().all())
    
    async def update_day(self, day: ItineraryDay) -> ItineraryDay:
        await self.db.commit()
        await self.db.refresh(day)
        return day
    
    async def delete_day(self, day: ItineraryDay) -> None:
        await self.db.delete(day)
        await self.db.commit()
    
    async def create_item(self, itinerary_day_id: str, activity_id: Optional[str],
                          order_index: int, start_time: Optional[str] = None,
                          end_time: Optional[str] = None, custom_title: Optional[str] = None,
                          custom_notes: Optional[str] = None) -> ItineraryItem:
        item = ItineraryItem(
            itinerary_day_id=itinerary_day_id,
            activity_id=activity_id,
            order_index=order_index,
            start_time=start_time,
            end_time=end_time,
            custom_title=custom_title,
            custom_notes=custom_notes
        )
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item
    
    async def get_item_by_id(self, item_id: str) -> Optional[ItineraryItem]:
        result = await self.db.execute(select(ItineraryItem).where(ItineraryItem.id == item_id))
        return result.scalar_one_or_none()
    
    async def get_items_by_day(self, day_id: str) -> List[ItineraryItem]:
        result = await self.db.execute(
            select(ItineraryItem)
            .where(ItineraryItem.itinerary_day_id == day_id)
            .order_by(ItineraryItem.order_index)
        )
        return list(result.scalars().all())
    
    async def update_item(self, item: ItineraryItem) -> ItineraryItem:
        await self.db.commit()
        await self.db.refresh(item)
        return item
    
    async def delete_item(self, item: ItineraryItem) -> None:
        await self.db.delete(item)
        await self.db.commit()
