from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Mountain(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False)
    elevation = Column(Integer, nullable=False) # dalam meter
    difficulty = Column(String) # Beginner, Intermediate, Hard
    latitude = Column(Float)
    longitude = Column(Float)
    
    trails = relationship("Trail", back_populates="mountain", cascade="all, delete-orphan", lazy="selectin")
