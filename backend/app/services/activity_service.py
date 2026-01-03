from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.activity_repository import ActivityRepository
from app.repositories.city_repository import CityRepository
from app.schemas.activity import ActivityCreate, ActivityUpdate
from app.models.activity import Activity


class ActivityService:
    def __init__(self, db: AsyncSession):
        self.repository = ActivityRepository(db)
        self.city_repository = CityRepository(db)
    
    async def create_activity(self, activity_data: ActivityCreate) -> Activity:
        city = await self.city_repository.get_by_id(activity_data.city_id)
        if not city:
            raise ValueError("City not found")
        
        return await self.repository.create(
            city_id=activity_data.city_id,
            name=activity_data.name,
            description=activity_data.description,
            category=activity_data.category,
            estimated_cost=activity_data.estimated_cost,
            estimated_duration=activity_data.estimated_duration,
            image_url=activity_data.image_url
        )
    
    async def get_activity_by_id(self, activity_id: str) -> Optional[Activity]:
        return await self.repository.get_by_id(activity_id)
    
    async def get_activities_by_city(self, city_id: str, skip: int = 0, limit: int = 100) -> List[Activity]:
        return await self.repository.get_by_city(city_id, skip, limit)
    
    async def get_activities_by_category(self, category: str, skip: int = 0, limit: int = 100) -> List[Activity]:
        return await self.repository.get_by_category(category, skip, limit)
    
    async def search_activities(self, query: str, skip: int = 0, limit: int = 50) -> List[Activity]:
        if not query or len(query) < 2:
            raise ValueError("Search query must be at least 2 characters")
        return await self.repository.search_by_name(query, skip, limit)
    
    async def update_activity(self, activity_id: str, activity_data: ActivityUpdate) -> Optional[Activity]:
        activity = await self.repository.get_by_id(activity_id)
        if not activity:
            return None
        
        if activity_data.name is not None:
            activity.name = activity_data.name
        if activity_data.description is not None:
            activity.description = activity_data.description
        if activity_data.category is not None:
            activity.category = activity_data.category
        if activity_data.estimated_cost is not None:
            activity.estimated_cost = activity_data.estimated_cost
        if activity_data.estimated_duration is not None:
            activity.estimated_duration = activity_data.estimated_duration
        if activity_data.image_url is not None:
            activity.image_url = activity_data.image_url
        
        return await self.repository.update(activity)
    
    async def delete_activity(self, activity_id: str) -> bool:
        activity = await self.repository.get_by_id(activity_id)
        if not activity:
            return False
        await self.repository.delete(activity)
        return True
