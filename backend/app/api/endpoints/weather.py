from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud import crud_mountain
from app.services import weather_service

router = APIRouter()

@router.get("/{mountain_id}")
async def get_mountain_weather(
    mountain_id: int,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Mengecek kondisi cuaca di lokasi gunung tertentu."""
    mountain = await crud_mountain.get(db, id=mountain_id)
    if not mountain:
        raise HTTPException(status_code=404, detail="Mountain not found")
    
    if mountain.latitude is None or mountain.longitude is None:
        raise HTTPException(status_code=400, detail="Koordinat gunung belum diset.")

    # Memanggil external service (Saat ini dimock)
    weather_data = await weather_service.get_weather_for_location(
        latitude=mountain.latitude,
        longitude=mountain.longitude
    )
    return weather_data
