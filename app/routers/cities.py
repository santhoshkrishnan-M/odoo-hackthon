from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.database import get_db
from app.services.city_service import CityService
from app.schemas.city import CityCreate, CityUpdate, CityResponse
from app.utils import ApiResponse
from app.utils.logger import logger

router = APIRouter(prefix="/cities", tags=["Cities"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_city(
    city_data: CityCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = CityService(db)
        city = await service.create_city(city_data)
        
        return ApiResponse.success(CityResponse.from_orm(city))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Create city error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("", response_model=dict)
async def search_cities(
    query: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = CityService(db)
        
        if query:
            cities = await service.search_cities(query, skip, limit)
        else:
            cities = await service.get_all_cities(skip, limit)
        
        return ApiResponse.success([CityResponse.from_orm(city) for city in cities])
    except Exception as e:
        logger.error(f"Search cities error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/{city_id}", response_model=dict)
async def get_city(
    city_id: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = CityService(db)
        city = await service.get_city_by_id(city_id)
        
        if not city:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
        
        return ApiResponse.success(CityResponse.from_orm(city))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get city error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put("/{city_id}", response_model=dict)
async def update_city(
    city_id: str,
    city_data: CityUpdate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = CityService(db)
        city = await service.update_city(city_id, city_data)
        
        if not city:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
        
        return ApiResponse.success(CityResponse.from_orm(city))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update city error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/{city_id}", response_model=dict)
async def delete_city(
    city_id: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = CityService(db)
        success = await service.delete_city(city_id)
        
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
        
        return ApiResponse.success({"message": "City deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete city error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
