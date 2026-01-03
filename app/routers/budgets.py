from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.budget_service import BudgetService
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse
from app.utils import ApiResponse
from app.utils.logger import logger
from app.middleware import get_current_user_id

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_budget(
    budget_data: BudgetCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = BudgetService(db)
        budget = await service.create_budget(current_user_id, budget_data)
        
        return ApiResponse.success(BudgetResponse.from_orm(budget))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Create budget error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/trips/{trip_id}", response_model=dict)
async def get_trip_budget(
    trip_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = BudgetService(db)
        budget = await service.get_budget_by_trip(trip_id, current_user_id)
        
        if not budget:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
        
        return ApiResponse.success(BudgetResponse.from_orm(budget))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get trip budget error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put("/{budget_id}", response_model=dict)
async def update_budget(
    budget_id: str,
    budget_data: BudgetUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = BudgetService(db)
        budget = await service.update_budget(budget_id, current_user_id, budget_data)
        
        if not budget:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
        
        return ApiResponse.success(BudgetResponse.from_orm(budget))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update budget error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/{budget_id}", response_model=dict)
async def delete_budget(
    budget_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = BudgetService(db)
        success = await service.delete_budget(budget_id, current_user_id)
        
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
        
        return ApiResponse.success({"message": "Budget deleted successfully"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete budget error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
