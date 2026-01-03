from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.database import get_db
from app.services.activity_service import ActivityService
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse
from app.utils import ApiResponse
from app.utils.logger import logger

router = APIRouter(prefix="/activities", tags=["Activities"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity_data: ActivityCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ActivityService(db)
        activity = await service.create_activity(activity_data)
        
        return ApiResponse.success(ActivityResponse.from_orm(activity))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Create activity error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("", response_model=dict)
async def search_activities(
    query: Optional[str] = Query(None),
    city_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ActivityService(db)
        
        if query:
            activities = await service.search_activities(query, skip, limit)
        elif city_id:
            activities = await service.get_activities_by_city(city_id, skip, limit)
        elif category:
            activities = await service.get_activities_by_category(category, skip, limit)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provide query, city_id, or category parameter"
            )
        
        return ApiResponse.success([ActivityResponse.from_orm(activity) for activity in activities])
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Search activities error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/{activity_id}", response_model=dict)
async def get_activity(
    activity_id: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ActivityService(db)
        activity = await service.get_activity_by_id(activity_id)
        
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        
        return ApiResponse.success(ActivityResponse.from_orm(activity))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get activity error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put("/{activity_id}", response_model=dict)
async def update_activity(
    activity_id: str,
    activity_data: ActivityUpdate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ActivityService(db)
        activity = await service.update_activity(activity_id, activity_data)
        
        if not activity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        
        return ApiResponse.success(ActivityResponse.from_orm(activity))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update activity error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/{activity_id}", response_model=dict)
async def delete_activity(
    activity_id: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ActivityService(db)
        success = await service.delete_activity(activity_id)
        
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
        
        return ApiResponse.success({"message": "Activity deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete activity error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
