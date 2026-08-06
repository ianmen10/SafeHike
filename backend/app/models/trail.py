from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Trail(Base):
    id = Column(Integer, primary_key=True, index=True)
    mountain_id = Column(Integer, ForeignKey("mountain.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    distance = Column(Float, nullable=False) # dalam kilometer
    estimated_duration = Column(Integer, nullable=False) # dalam jam
    
    mountain = relationship("Mountain", back_populates="trails")
