from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from app.models.activity import Activity


class ActivityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, city_id: str, name: str, description: Optional[str],
                     category: str, estimated_cost: Optional[float] = None,
                     estimated_duration: Optional[int] = None,
                     image_url: Optional[str] = None) -> Activity:
        activity = Activity(
            city_id=city_id,
            name=name,
            description=description,
            category=category,
            estimated_cost=estimated_cost,
            estimated_duration=estimated_duration,
            image_url=image_url
        )
        self.db.add(activity)
        await self.db.commit()
        await self.db.refresh(activity)
        return activity
    
    async def get_by_id(self, activity_id: str) -> Optional[Activity]:
        result = await self.db.execute(select(Activity).where(Activity.id == activity_id))
        return result.scalar_one_or_none()
    
    async def get_by_city(self, city_id: str, skip: int = 0, limit: int = 100) -> List[Activity]:
        result = await self.db.execute(
            select(Activity).where(Activity.city_id == city_id).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
    
    async def get_by_category(self, category: str, skip: int = 0, limit: int = 100) -> List[Activity]:
        result = await self.db.execute(
            select(Activity).where(Activity.category == category).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
    
    async def search_by_name(self, query: str, skip: int = 0, limit: int = 50) -> List[Activity]:
        search_pattern = f"%{query}%"
        result = await self.db.execute(
            select(Activity).where(Activity.name.ilike(search_pattern)).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
    
    async def update(self, activity: Activity) -> Activity:
        await self.db.commit()
        await self.db.refresh(activity)
        return activity
    
    async def delete(self, activity: Activity) -> None:
        await self.db.delete(activity)
        await self.db.commit()
