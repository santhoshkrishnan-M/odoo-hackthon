from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.shared_trip_service import SharedTripService
from app.services.trip_service import TripService
from app.schemas.shared_trip import SharedTripCreate, SharedTripResponse
from app.schemas.trip import TripResponse
from app.utils import ApiResponse
from app.utils.logger import logger
from app.middleware import get_current_user_id

router = APIRouter(prefix="/shared", tags=["Shared Trips"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_shared_trip(
    shared_trip_data: SharedTripCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = SharedTripService(db)
        shared_trip = await service.create_shared_trip(current_user_id, shared_trip_data)
        
        return ApiResponse.success(SharedTripResponse.from_orm(shared_trip))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Create shared trip error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/{share_token}", response_model=dict)
async def get_shared_trip(
    share_token: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = SharedTripService(db)
        result = await service.get_shared_trip_by_token(share_token)
        
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shared trip not found or expired")
        
        shared_trip, trip = result
        
        return ApiResponse.success({
            "shared_trip": SharedTripResponse.from_orm(shared_trip),
            "trip": TripResponse.from_orm(trip)
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get shared trip error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/{shared_trip_id}", response_model=dict)
async def revoke_shared_trip(
    shared_trip_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = SharedTripService(db)
        success = await service.revoke_shared_trip(shared_trip_id, current_user_id)
        
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shared trip not found")
        
        return ApiResponse.success({"message": "Shared trip revoked successfully"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Revoke shared trip error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
