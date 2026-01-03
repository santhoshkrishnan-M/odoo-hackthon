"""
Itinerary router.
Handles trip itinerary management.
"""
from fastapi import APIRouter, status
from app.itinerary import schemas
from typing import List

router = APIRouter(
    prefix="/itinerary",
    tags=["Itinerary"],
    responses={404: {"description": "Not found"}},
)


@router.get("/trips/{trip_id}", response_model=List[schemas.ItineraryResponse])
async def get_trip_itinerary(trip_id: int) -> dict:
    """
    Get all itinerary items for a trip.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.post("/trips/{trip_id}", response_model=schemas.ItineraryResponse, status_code=status.HTTP_201_CREATED)
async def add_itinerary_item(trip_id: int, request: schemas.ItineraryCreate) -> dict:
    """
    Add new itinerary item to trip.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.put("/{item_id}", response_model=schemas.ItineraryResponse)
async def update_itinerary_item(item_id: int, request: schemas.ItineraryUpdate) -> dict:
    """
    Update itinerary item.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }


@router.delete("/{item_id}", response_model=dict)
async def delete_itinerary_item(item_id: int) -> dict:
    """
    Delete itinerary item.
    """
    return {
        "message": "Not implemented",
        "status": "placeholder"
    }
