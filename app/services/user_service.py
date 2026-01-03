from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User
from app.utils import hash_password, verify_password, create_access_token, create_refresh_token


class UserService:
    def __init__(self, db: AsyncSession):
        self.repository = UserRepository(db)
    
    async def create_user(self, user_data: UserCreate) -> User:
        existing_user = await self.repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("Email already registered")
        
        hashed_password = hash_password(user_data.password)
        return await self.repository.create(
            email=user_data.email,
            hashed_password=hashed_password,
            name=user_data.name
        )
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = await self.repository.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user
    
    async def generate_tokens(self, user: User) -> dict:
        payload = {
            "user_id": user.id,
            "email": user.email,
            "role": user.role.value
        }
        access_token = create_access_token(payload)
        refresh_token = create_refresh_token(payload)
        
        await self.repository.update_refresh_token(user, refresh_token)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        return await self.repository.get_by_id(user_id)
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        user = await self.repository.get_by_id(user_id)
        if not user:
            return None
        
        if user_data.email:
            existing_user = await self.repository.get_by_email(user_data.email)
            if existing_user and existing_user.id != user_id:
                raise ValueError("Email already in use")
            user.email = user_data.email
        
        if user_data.name:
            user.name = user_data.name
        
        return await self.repository.update(user)
    
    async def delete_user(self, user_id: str) -> bool:
        user = await self.repository.get_by_id(user_id)
        if not user:
            return False
        await self.repository.soft_delete(user)
        return True
    
    async def logout_user(self, user_id: str) -> bool:
        user = await self.repository.get_by_id(user_id)
        if not user:
            return False
        await self.repository.update_refresh_token(user, None)
        return True
    
    async def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return await self.repository.get_all(skip, limit)
