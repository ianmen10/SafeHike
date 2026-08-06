from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud import crud_mountain, crud_trail
from app.schemas.mountain import Mountain, MountainCreate
from app.schemas.trail import Trail, TrailCreate

router = APIRouter()

@router.get("/", response_model=List[Mountain])
async def read_mountains(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Mengambil daftar semua gunung beserta jalurnya."""
    mountains = await crud_mountain.get_multi(db, skip=skip, limit=limit)
    return mountains

@router.post("/", response_model=Mountain)
async def create_mountain(
    *,
    db: AsyncSession = Depends(deps.get_db),
    mountain_in: MountainCreate,
    current_user = Depends(deps.get_current_active_user), # Hanya user aktif yg bisa nambah
) -> Any:
    """Menambahkan data gunung baru."""
    mountain = await crud_mountain.create(db, obj_in=mountain_in)
    return mountain

@router.post("/{mountain_id}/trails", response_model=Trail)
async def create_trail_for_mountain(
    *,
    db: AsyncSession = Depends(deps.get_db),
    mountain_id: int,
    trail_in: TrailCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """Menambahkan jalur pendakian ke gunung tertentu."""
    mountain = await crud_mountain.get(db, id=mountain_id)
    if not mountain:
        raise HTTPException(status_code=404, detail="Mountain not found")
    trail = await crud_trail.create_for_mountain(db=db, obj_in=trail_in, mountain_id=mountain_id)
    return trail
