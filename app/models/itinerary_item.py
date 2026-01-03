from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    itinerary_day_id = Column(String, ForeignKey("itinerary_days.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(String, ForeignKey("activities.id", ondelete="SET NULL"), nullable=True)
    order_index = Column(Integer, nullable=False)
    start_time = Column(String, nullable=True)
    end_time = Column(String, nullable=True)
    custom_title = Column(String, nullable=True)
    custom_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    itinerary_day = relationship("ItineraryDay", back_populates="items")
    activity = relationship("Activity", back_populates="itinerary_items")
