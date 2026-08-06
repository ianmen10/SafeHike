from sqlalchemy.ext.asyncio import AsyncSession
from app.models.trail import Trail
from app.schemas.trail import TrailCreate

async def create_for_mountain(db: AsyncSession, obj_in: TrailCreate, mountain_id: int) -> Trail:
    db_obj = Trail(**obj_in.model_dump(), mountain_id=mountain_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
