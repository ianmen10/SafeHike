from pydantic import BaseModel
from typing import Optional

class AIRecommendationRequest(BaseModel):
    mountain_name: str
    trail_name: str
    weather_condition: str
    temperature_celsius: float
    user_experience_level: Optional[str] = "Pemula"

class AIRecommendationResponse(BaseModel):
    recommendation_text: str
