from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id = Column(String, ForeignKey("trips.id", ondelete="CASCADE"), unique=True, nullable=False)
    total_budget = Column(Float, nullable=False)
    accommodation = Column(Float, default=0.0, nullable=False)
    transportation = Column(Float, default=0.0, nullable=False)
    food = Column(Float, default=0.0, nullable=False)
    activities = Column(Float, default=0.0, nullable=False)
    shopping = Column(Float, default=0.0, nullable=False)
    other = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    trip = relationship("Trip", back_populates="budget")
