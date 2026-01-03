from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.city_repository import CityRepository
from app.schemas.city import CityCreate, CityUpdate
from app.models.city import City


class CityService:
    def __init__(self, db: AsyncSession):
        self.repository = CityRepository(db)
    
    async def create_city(self, city_data: CityCreate) -> City:
        existing_city = await self.repository.get_by_name_and_country(
            city_data.name, city_data.country
        )
        if existing_city:
            raise ValueError("City already exists")
        
        return await self.repository.create(
            name=city_data.name,
            country=city_data.country,
            description=city_data.description,
            image_url=city_data.image_url
        )
    
    async def get_city_by_id(self, city_id: str) -> Optional[City]:
        return await self.repository.get_by_id(city_id)
    
    async def search_cities(self, query: str, skip: int = 0, limit: int = 50) -> List[City]:
        if not query or len(query) < 2:
            return await self.repository.get_all(skip, limit)
        return await self.repository.search(query, skip, limit)
    
    async def get_all_cities(self, skip: int = 0, limit: int = 100) -> List[City]:
        return await self.repository.get_all(skip, limit)
    
    async def update_city(self, city_id: str, city_data: CityUpdate) -> Optional[City]:
        city = await self.repository.get_by_id(city_id)
        if not city:
            return None
        
        if city_data.name is not None:
            city.name = city_data.name
        if city_data.country is not None:
            city.country = city_data.country
        if city_data.description is not None:
            city.description = city_data.description
        if city_data.image_url is not None:
            city.image_url = city_data.image_url
        
        return await self.repository.update(city)
    
    async def delete_city(self, city_id: str) -> bool:
        city = await self.repository.get_by_id(city_id)
        if not city:
            return False
        await self.repository.delete(city)
        return True
