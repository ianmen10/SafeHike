import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SafeHike API"
    API_V1_STR: str = "/api/v1"
    
    # Secret key untuk JWT (Idealnya di-load dari env variables, kita sediakan default untuk dev)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "b3c6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Karena Docker tidak terdeteksi di terminal, kita menggunakan SQLite Async untuk lokal
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./safehike.db")

    class Config:
        case_sensitive = True

settings = Settings()
