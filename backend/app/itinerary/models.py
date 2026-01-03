"""
Itinerary model definitions.
"""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text

from app.core.database import Base


class Itinerary(Base):
    """
    Itinerary model representing daily plans within a trip.
    """
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    day_number = Column(Integer, nullable=False)
    activity = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<Itinerary(id={self.id}, trip_id={self.trip_id}, day={self.day_number})>"
