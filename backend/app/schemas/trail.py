from pydantic import BaseModel

class TrailBase(BaseModel):
    name: str
    distance: float
    estimated_duration: int

class TrailCreate(TrailBase):
    pass

class Trail(TrailBase):
    id: int
    mountain_id: int

    class Config:
        from_attributes = True
