from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.mountain import Mountain
from app.schemas.mountain import MountainCreate

async def get_multi(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Mountain]:
    result = await db.execute(
        select(Mountain)
        .options(selectinload(Mountain.trails))
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())

async def get(db: AsyncSession, id: int) -> Optional[Mountain]:
    result = await db.execute(
        select(Mountain)
        .options(selectinload(Mountain.trails))
        .where(Mountain.id == id)
    )
    return result.scalars().first()

async def create(db: AsyncSession, obj_in: MountainCreate) -> Mountain:
    db_obj = Mountain(**obj_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
