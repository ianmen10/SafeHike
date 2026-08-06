from typing import Any
from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/recommendation", response_model=AIRecommendationResponse)
async def get_trip_recommendation(
    mountain_id: int,
    trail_id: int,
    experience_level: str = "Pemula",
    db: AsyncSession = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    """
    Fitur Utama: Menggabungkan data gunung, jalur, dan cuaca 
    lalu meminta rekomendasi kepada AI.
    """
    mountain = await crud_mountain.get(db, id=mountain_id)
    if not mountain:
        raise HTTPException(status_code=404, detail="Mountain not found")
        
    # Validasi keberadaan jalur di gunung tersebut
    trail = next((t for t in mountain.trails if t.id == trail_id), None)
    if not trail:
        raise HTTPException(status_code=404, detail="Trail not found on this mountain")
        
    if not mountain.latitude or not mountain.longitude:
        raise HTTPException(status_code=400, detail="Mountain coordinates missing")
        
    # Mengambil cuaca secara real-time (saat ini mock)
    weather = await weather_service.get_weather_for_location(
        latitude=mountain.latitude, 
        longitude=mountain.longitude
    )
    
    # Merakit Request untuk AI
    ai_request = AIRecommendationRequest(
        mountain_name=mountain.name,
        trail_name=trail.name,
        weather_condition=weather["condition"],
        temperature_celsius=weather["temperature_celsius"],
        user_experience_level=experience_level
    )
    
    # Memanggil abstraksi AI Service
    response = await ai_service.get_hike_recommendation(ai_request)
    return response

@router.post("/chat", response_model=AIChatResponse)
async def chat_assistant(
    request: AIChatRequest,
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    """Chat bebas dengan AI Safety Assistant."""
    response = await ai_service.chat_with_assistant(request)
    return response
