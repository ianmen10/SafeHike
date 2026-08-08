import asyncio
import logging
from sqlalchemy import select
from app.db.database import AsyncSessionLocal
import app.models.trail
import app.models.mountain
from app.models.mountain import Mountain

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MOUNTAIN_DATA = [
    {"id": 1, "name": "Gunung Gede", "location": "Jawa Barat", "elevation": 2958, "difficulty": "Sedang", "latitude": -6.7833, "longitude": 106.9833},
    {"id": 2, "name": "Gunung Semeru", "location": "Jawa Timur", "elevation": 3676, "difficulty": "Sangat Sulit", "latitude": -8.1080, "longitude": 112.9220},
    {"id": 3, "name": "Gunung Prau", "location": "Jawa Tengah", "elevation": 2565, "difficulty": "Mudah", "latitude": -7.1872, "longitude": 109.9234},
    {"id": 4, "name": "Gunung Arjuno", "location": "Jawa Timur", "elevation": 3339, "difficulty": "Sulit", "latitude": -7.7280, "longitude": 112.5890},
    {"id": 5, "name": "Gunung Argopuro", "location": "Jawa Timur", "elevation": 3088, "difficulty": "Sangat Sulit", "latitude": -7.9667, "longitude": 113.5667},
    {"id": 6, "name": "Gunung Raung", "location": "Jawa Timur", "elevation": 3344, "difficulty": "Ekstrem", "latitude": -8.1250, "longitude": 114.0450},
    {"id": 7, "name": "Gunung Rinjani", "location": "Nusa Tenggara Barat", "elevation": 3726, "difficulty": "Sangat Sulit", "latitude": -8.4113, "longitude": 116.4574},
    {"id": 8, "name": "Gunung Buthak", "location": "Jawa Timur", "elevation": 2868, "difficulty": "Sedang", "latitude": -7.9258, "longitude": 112.4514},
    {"id": 9, "name": "Gunung Merbabu", "location": "Jawa Tengah", "elevation": 3145, "difficulty": "Sedang", "latitude": -7.4539, "longitude": 110.4403},
    {"id": 10, "name": "Gunung Lawu", "location": "Jawa Tengah / Jawa Timur", "elevation": 3265, "difficulty": "Sedang", "latitude": -7.6250, "longitude": 111.1920},
    {"id": 11, "name": "Gunung Sindoro", "location": "Jawa Tengah", "elevation": 3136, "difficulty": "Sulit", "latitude": -7.3006, "longitude": 109.9983},
    {"id": 12, "name": "Gunung Sumbing", "location": "Jawa Tengah", "elevation": 3371, "difficulty": "Sulit", "latitude": -7.3842, "longitude": 110.0700},
    {"id": 13, "name": "Gunung Slamet", "location": "Jawa Tengah", "elevation": 3428, "difficulty": "Sangat Sulit", "latitude": -7.2425, "longitude": 109.2092},
]

async def seed_coordinates():
    logger.info("Updating mountain coordinates in database...")
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(Mountain))
        existing_mountains = {m.id: m for m in res.scalars().all()}
        
        for data in MOUNTAIN_DATA:
            if data["id"] in existing_mountains:
                m = existing_mountains[data["id"]]
                m.latitude = data["latitude"]
                m.longitude = data["longitude"]
                m.name = data["name"]
                m.location = data["location"]
                m.elevation = data["elevation"]
                m.difficulty = data["difficulty"]
            else:
                m = Mountain(**data)
                session.add(m)
                
        await session.commit()
        logger.info("Successfully updated coordinates for all mountains!")

if __name__ == "__main__":
    asyncio.run(seed_coordinates())
