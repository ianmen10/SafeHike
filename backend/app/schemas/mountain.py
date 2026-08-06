from typing import List, Optional
from pydantic import BaseModel
from app.schemas.trail import Trail

class MountainBase(BaseModel):
    name: str
    location: str
    elevation: int
    difficulty: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class MountainCreate(MountainBase):
    pass

class Mountain(MountainBase):
    id: int
    trails: List[Trail] = []

    class Config:
        from_attributes = True
