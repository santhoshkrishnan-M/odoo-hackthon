from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from app.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, email: str, hashed_password: str, name: str) -> User:
        user = User(email=email, password=hashed_password, name=name)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def get_by_id(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.id == user_id, User.is_deleted == False)
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.email == email, User.is_deleted == False)
        )
        return result.scalar_one_or_none()
    
    async def update(self, user: User) -> User:
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def soft_delete(self, user: User) -> None:
        user.is_deleted = True
        await self.db.commit()
    
    async def update_refresh_token(self, user: User, refresh_token: Optional[str]) -> None:
        user.refresh_token = refresh_token
        await self.db.commit()
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        result = await self.db.execute(
            select(User).where(User.is_deleted == False).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
