from pydantic import BaseModel
from typing import Optional, List

# --- Trip Planner Schemas ---
class AIRecommendationRequest(BaseModel):
    mountain_name: str
    trail_name: str
    weather_condition: str
    temperature_celsius: float
    user_experience_level: Optional[str] = "Pemula"

class AIRecommendationResponse(BaseModel):
    recommendation_text: str

# --- Chatbot Schemas ---
class ChatMessage(BaseModel):
    role: str  # e.g., 'user' or 'assistant'
    content: str

class AIChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class AIChatResponse(BaseModel):
    reply: str
