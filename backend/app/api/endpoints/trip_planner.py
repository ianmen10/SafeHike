from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud import crud_mountain
from app.services import weather_service
from app.ai.services.ai_service import ai_service
from app.ai.schemas.ai_schemas import (
    AIRecommendationRequest, 
    AIRecommendationResponse,
    AIChatRequest,
    AIChatResponse
)

router = APIRouter()

class FlexibleRecommendationRequest(BaseModel):
    mountain_id: Optional[int] = None
    trail_id: Optional[int] = None
    mountain_name: Optional[str] = None
    trail_name: Optional[str] = None
    user_experience: Optional[str] = "Pemula"
    duration_days: Optional[int] = 2

async def _process_recommendation(
    payload: Optional[FlexibleRecommendationRequest],
    mountain_id: Optional[int],
    trail_id: Optional[int],
    experience_level: str,
    db: AsyncSession
) -> dict:
    m_name = payload.mountain_name if (payload and payload.mountain_name) else None
    t_name = payload.trail_name if (payload and payload.trail_name) else None
    exp = payload.user_experience if (payload and payload.user_experience) else experience_level
    days = payload.duration_days if (payload and payload.duration_days) else 2

    m_id = payload.mountain_id if (payload and payload.mountain_id) else mountain_id
    t_id = payload.trail_id if (payload and payload.trail_id) else trail_id

    weather_cond = "Cerah Berawan"
    temp_c = 18.0

    if m_id:
        mountain = await crud_mountain.get(db, id=m_id)
        if mountain:
            m_name = mountain.name
            if t_id:
                trail = next((t for t in mountain.trails if t.id == t_id), None)
                if trail:
                    t_name = trail.name
            if mountain.latitude and mountain.longitude:
                try:
                    w = await weather_service.get_weather_for_location(
                        latitude=mountain.latitude, 
                        longitude=mountain.longitude
                    )
                    weather_cond = w.get("weather", {}).get("description", weather_cond)
                    temp_c = w.get("weather", {}).get("temp", temp_c)
                except Exception:
                    pass

    if not m_name:
        m_name = "Gunung Indonesia"
    if not t_name:
        t_name = "Jalur Utama"

    ai_req = AIRecommendationRequest(
        mountain_name=m_name,
        trail_name=f"{t_name} (Durasi {days} Hari)",
        weather_condition=weather_cond,
        temperature_celsius=float(temp_c),
        user_experience_level=exp
    )

    resp = await ai_service.get_hike_recommendation(ai_req)
    
    return {
        "recommendation": resp.recommendation_text,
        "recommendations": resp.recommendation_text,
        "recommendation_text": resp.recommendation_text
    }

@router.post("/recommendations")
async def get_trip_recommendations_plural(
    payload: Optional[FlexibleRecommendationRequest] = None,
    mountain_id: Optional[int] = None,
    trail_id: Optional[int] = None,
    experience_level: str = "Pemula",
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    return await _process_recommendation(payload, mountain_id, trail_id, experience_level, db)

@router.post("/recommendation")
async def get_trip_recommendation_singular(
    payload: Optional[FlexibleRecommendationRequest] = None,
    mountain_id: Optional[int] = None,
    trail_id: Optional[int] = None,
    experience_level: str = "Pemula",
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    return await _process_recommendation(payload, mountain_id, trail_id, experience_level, db)

@router.post("/chat", response_model=AIChatResponse)
async def chat_assistant(
    request: AIChatRequest
) -> Any:
    """Chat bebas dengan AI Safety Assistant."""
    response = await ai_service.chat_with_assistant(request)
    return response
