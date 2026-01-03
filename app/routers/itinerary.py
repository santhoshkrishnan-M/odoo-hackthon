from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.itinerary_service import ItineraryService
from app.schemas.itinerary import (
    ItineraryDayCreate, ItineraryDayUpdate, ItineraryDayResponse,
    ItineraryItemCreate, ItineraryItemUpdate, ItineraryItemResponse
)
from app.utils import ApiResponse
from app.utils.logger import logger
from app.middleware import get_current_user_id

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])


@router.post("/days", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_itinerary_day(
    day_data: ItineraryDayCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        day = await service.create_day(current_user_id, day_data)
        
        return ApiResponse.success(ItineraryDayResponse.from_orm(day))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Create itinerary day error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/trips/{trip_id}/days", response_model=dict)
async def get_trip_itinerary_days(
    trip_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        days = await service.get_days_by_trip(trip_id, current_user_id)
        
        return ApiResponse.success([ItineraryDayResponse.from_orm(day) for day in days])
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        logger.error(f"Get trip itinerary days error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put("/days/{day_id}", response_model=dict)
async def update_itinerary_day(
    day_id: str,
    day_data: ItineraryDayUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        day = await service.update_day(day_id, current_user_id, day_data)
        
        if not day:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary day not found")
        
        return ApiResponse.success(ItineraryDayResponse.from_orm(day))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update itinerary day error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/days/{day_id}", response_model=dict)
async def delete_itinerary_day(
    day_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        success = await service.delete_day(day_id, current_user_id)
        
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary day not found")
        
        return ApiResponse.success({"message": "Itinerary day deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete itinerary day error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.post("/items", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_itinerary_item(
    item_data: ItineraryItemCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        item = await service.create_item(current_user_id, item_data)
        
        return ApiResponse.success(ItineraryItemResponse.from_orm(item))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Create itinerary item error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/days/{day_id}/items", response_model=dict)
async def get_day_itinerary_items(
    day_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        items = await service.get_items_by_day(day_id, current_user_id)
        
        return ApiResponse.success([ItineraryItemResponse.from_orm(item) for item in items])
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        logger.error(f"Get day itinerary items error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put("/items/{item_id}", response_model=dict)
async def update_itinerary_item(
    item_id: str,
    item_data: ItineraryItemUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        item = await service.update_item(item_id, current_user_id, item_data)
        
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary item not found")
        
        return ApiResponse.success(ItineraryItemResponse.from_orm(item))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update itinerary item error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/items/{item_id}", response_model=dict)
async def delete_itinerary_item(
    item_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ItineraryService(db)
        success = await service.delete_item(item_id, current_user_id)
        
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Itinerary item not found")
        
        return ApiResponse.success({"message": "Itinerary item deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete itinerary item error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
