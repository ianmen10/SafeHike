from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SafeHike API",
    description="Backend API for SafeHike Platform",
    version="1.0.0"
)

# Konfigurasi CORS agar frontend dapat mengakses API (Penting untuk pemisahan layer)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan spesifik origin di production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to SafeHike API", "status": "Running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
