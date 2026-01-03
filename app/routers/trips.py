from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.services.trip_service import TripService
from app.schemas.trip import TripCreate, TripUpdate, TripResponse
from app.utils import ApiResponse
from app.utils.logger import logger
from app.middleware import get_current_user_id

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_trip(
    trip_data: TripCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = TripService(db)
        trip = await service.create_trip(current_user_id, trip_data)
        
        return ApiResponse.success(TripResponse.from_orm(trip))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Create trip error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("", response_model=dict)
async def get_user_trips(
    skip: int = 0,
    limit: int = 100,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = TripService(db)
        trips = await service.get_user_trips(current_user_id, skip, limit)
        
        return ApiResponse.success([TripResponse.from_orm(trip) for trip in trips])
    except Exception as e:
        logger.error(f"Get user trips error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/{trip_id}", response_model=dict)
async def get_trip(
    trip_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = TripService(db)
        trip = await service.get_trip_by_id(trip_id)
        
        if not trip or trip.user_id != current_user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
        return ApiResponse.success(TripResponse.from_orm(trip))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get trip error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put("/{trip_id}", response_model=dict)
async def update_trip(
    trip_id: str,
    trip_data: TripUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = TripService(db)
        trip = await service.update_trip(trip_id, current_user_id, trip_data)
        
        if not trip:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
        return ApiResponse.success(TripResponse.from_orm(trip))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update trip error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/{trip_id}", response_model=dict)
async def delete_trip(
    trip_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = TripService(db)
        success = await service.delete_trip(trip_id, current_user_id)
        
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
        return ApiResponse.success({"message": "Trip deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete trip error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
