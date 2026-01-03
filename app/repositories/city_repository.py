from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import Optional, List
from app.models.city import City


class CityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, name: str, country: str, description: Optional[str] = None,
                     image_url: Optional[str] = None) -> City:
        city = City(name=name, country=country, description=description, image_url=image_url)
        self.db.add(city)
        await self.db.commit()
        await self.db.refresh(city)
        return city
    
    async def get_by_id(self, city_id: str) -> Optional[City]:
        result = await self.db.execute(select(City).where(City.id == city_id))
        return result.scalar_one_or_none()
    
    async def get_by_name_and_country(self, name: str, country: str) -> Optional[City]:
        result = await self.db.execute(
            select(City).where(City.name == name, City.country == country)
        )
        return result.scalar_one_or_none()
    
    async def search(self, query: str, skip: int = 0, limit: int = 50) -> List[City]:
        search_pattern = f"%{query}%"
        result = await self.db.execute(
            select(City)
            .where(or_(City.name.ilike(search_pattern), City.country.ilike(search_pattern)))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[City]:
        result = await self.db.execute(select(City).offset(skip).limit(limit))
        return list(result.scalars().all())
    
    async def update(self, city: City) -> City:
        await self.db.commit()
        await self.db.refresh(city)
        return city
    
    async def delete(self, city: City) -> None:
        await self.db.delete(city)
        await self.db.commit()
