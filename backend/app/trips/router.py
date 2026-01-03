"""
Trips router.
Handles trip creation, retrieval, and management.
"""
from fastapi import APIRouter, status
from app.trips import schemas
from typing import List

router = APIRouter(
    prefix="/trips",
    tags=["Trips"],
    responses={404: {"description": "Not found"}},
)


@router.get("", response_model=List[schemas.TripResponse])
async def list_trips() -> dict:
    """
    List all user trips.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.post("", response_model=schemas.TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(request: schemas.TripCreate) -> dict:
    """
    Create new trip.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.get("/{trip_id}", response_model=schemas.TripDetailResponse)
async def get_trip(trip_id: int) -> dict:
    """
    Get trip details by ID.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.put("/{trip_id}", response_model=schemas.TripResponse)
async def update_trip(trip_id: int, request: schemas.TripUpdate) -> dict:
    """
    Update trip information.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.delete("/{trip_id}", response_model=dict)
async def delete_trip(trip_id: int) -> dict:
    """
    Delete trip.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }
