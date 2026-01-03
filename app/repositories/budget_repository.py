from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.models.budget import Budget


class BudgetRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, trip_id: str, total_budget: float,
                     accommodation: float = 0.0, transportation: float = 0.0,
                     food: float = 0.0, activities: float = 0.0,
                     shopping: float = 0.0, other: float = 0.0) -> Budget:
        budget = Budget(
            trip_id=trip_id,
            total_budget=total_budget,
            accommodation=accommodation,
            transportation=transportation,
            food=food,
            activities=activities,
            shopping=shopping,
            other=other
        )
        self.db.add(budget)
        await self.db.commit()
        await self.db.refresh(budget)
        return budget
    
    async def get_by_id(self, budget_id: str) -> Optional[Budget]:
        result = await self.db.execute(select(Budget).where(Budget.id == budget_id))
        return result.scalar_one_or_none()
    
    async def get_by_trip(self, trip_id: str) -> Optional[Budget]:
        result = await self.db.execute(select(Budget).where(Budget.trip_id == trip_id))
        return result.scalar_one_or_none()
    
    async def update(self, budget: Budget) -> Budget:
        await self.db.commit()
        await self.db.refresh(budget)
        return budget
    
    async def delete(self, budget: Budget) -> None:
        await self.db.delete(budget)
        await self.db.commit()
