from fastapi import APIRouter
from app.api.endpoints import auth, mountains, weather, trip_planner

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(mountains.router, prefix="/mountains", tags=["mountains"])
api_router.include_router(weather.router, prefix="/weather", tags=["weather"])
api_router.include_router(trip_planner.router, prefix="/trip-planner", tags=["trip_planner"])
