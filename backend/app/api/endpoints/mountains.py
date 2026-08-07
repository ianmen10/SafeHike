from typing import Any, List
import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.crud import crud_mountain, crud_trail
from app.schemas.mountain import Mountain, MountainCreate
from app.schemas.trail import Trail, TrailCreate

router = APIRouter()

MOUNTAIN_DESCRIPTIONS = {
    "default": (
        "Gunung ini merupakan salah satu destinasi pendakian favorit di Indonesia, "
        "menawarkan pemandangan alam yang memukau dengan ekosistem yang kaya dan beragam. "
        "Jalur pendakiannya melewati hutan tropis yang rimbun, padang edelweis, "
        "hingga mencapai puncak dengan panorama 360 derajat yang spektakuler. "
        "Gunung ini menjadi magnet bagi para pendaki dari seluruh nusantara "
        "yang ingin menikmati keindahan alam pegunungan Indonesia."
    )
}

VEGETATION_TYPES = [
    "Hutan Montane, Subalpine, Edelweis",
    "Hutan Hujan Tropis, Semak Subalpine",
    "Hutan Dipterocarpus, Hutan Montane, Padang Rumput Alpine",
    "Hutan Pinus, Hutan Cemara, Edelweis",
    "Hutan Tropis Basah, Vegetasi Subalpine"
]

MOUNTAIN_TYPES = ["Stratovolcano", "Gunung Api Perisai", "Gunung Api Kerucut", "Pegunungan Lipatan", "Gunung Api Maar"]

BASECAMP_NAMES = ["Cemoro Sewu", "Patak Banteng", "Cibodas", "Sembalun", "Ranu Pane", "Selo", "Kalipancur", "Baturaden"]

@router.get("/", response_model=List[Mountain])
async def read_mountains(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Mengambil daftar semua gunung beserta jalurnya."""
    mountains = await crud_mountain.get_multi(db, skip=skip, limit=limit)
    return mountains

@router.get("/{mountain_id}", response_model=Mountain)
async def read_mountain(
    mountain_id: int,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """Mengambil detail satu gunung berdasarkan ID beserta jalurnya."""
    mountain = await crud_mountain.get(db, id=mountain_id)
    if not mountain:
        raise HTTPException(status_code=404, detail="Gunung tidak ditemukan")
    return mountain


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


@router.get("/{mountain_id}/stats")
async def get_mountain_stats(
    mountain_id: int,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Mengambil statistik gunung (deterministik berdasarkan ID gunung).
    Data diseed berdasarkan mountain_id agar konsisten tanpa perlu database.
    """
    mountain = await crud_mountain.get(db, id=mountain_id)
    if not mountain:
        raise HTTPException(status_code=404, detail="Gunung tidak ditemukan")

    rng = random.Random(mountain_id * 31337)  # Seed deterministik

    MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
              "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

    # Buat data pengunjung per bulan yang realistis
    # Puncak kunjungan biasanya Juni-Agustus (musim kemarau)
    base_visitors = rng.randint(200, 800)
    seasonal_multipliers = [0.6, 0.5, 0.7, 0.8, 1.0, 1.4, 1.8, 1.9, 1.5, 0.9, 0.7, 0.8]
    monthly_visitors = [
        {
            "month": MONTHS[i],
            "visitors": int(base_visitors * seasonal_multipliers[i] * rng.uniform(0.85, 1.15))
        }
        for i in range(12)
    ]

    # Statistik ringkas
    total_yearly = sum(m["visitors"] for m in monthly_visitors)
    summit_rate = rng.randint(72, 96)  # persentase berhasil summit
    avg_duration = rng.uniform(1.5, 3.5)  # hari rata-rata

    # Distribusi pendaki per jalur
    trails = mountain.trails
    if trails:
        trail_percentages = []
        remaining = 100
        for i, trail in enumerate(trails):
            if i == len(trails) - 1:
                pct = remaining
            else:
                pct = rng.randint(10, max(11, remaining - 10 * (len(trails) - i - 1)))
                pct = min(pct, remaining)
            trail_percentages.append({"name": trail.name, "percentage": pct})
            remaining -= pct
    else:
        trail_percentages = [{"name": "Jalur Utama", "percentage": 100}]

    # Tingkat kesulitan distribusi pendaki
    difficulty_dist = {
        "Pemula": rng.randint(20, 40),
        "Menengah": rng.randint(30, 50),
        "Expert": rng.randint(10, 30),
    }

    return {
        "mountain_id": mountain_id,
        "mountain_name": mountain.name,
        "monthly_visitors": monthly_visitors,
        "total_yearly_visitors": total_yearly,
        "summit_success_rate": summit_rate,
        "average_trip_duration_days": round(avg_duration, 1),
        "trail_distribution": trail_percentages,
        "hiker_experience_distribution": difficulty_dist,
    }


@router.get("/{mountain_id}/info")
async def get_mountain_info(
    mountain_id: int,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Mengambil informasi umum gunung (deterministik berdasarkan ID gunung).
    """
    mountain = await crud_mountain.get(db, id=mountain_id)
    if not mountain:
        raise HTTPException(status_code=404, detail="Gunung tidak ditemukan")

    rng = random.Random(mountain_id * 13337)

    vegetation = VEGETATION_TYPES[mountain_id % len(VEGETATION_TYPES)]
    mountain_type = MOUNTAIN_TYPES[mountain_id % len(MOUNTAIN_TYPES)]
    basecamp_name = BASECAMP_NAMES[mountain_id % len(BASECAMP_NAMES)]
    basecamp_elevation = rng.randint(900, 1800)

    status_options = ["Aktif", "Aktif Tipe B", "Tidak Aktif", "Aktif Waspada"]
    status_weights = [0.4, 0.3, 0.2, 0.1]
    status_idx = rng.choices(range(len(status_options)), weights=status_weights)[0]
    volcano_status = status_options[status_idx]

    permitted_options = ["Terbuka", "Terbuka (Izin Wajib)", "Terbatas"]
    permitted = permitted_options[mountain_id % len(permitted_options)]

    return {
        "mountain_id": mountain_id,
        "mountain_name": mountain.name,
        "description": (
            f"{mountain.name} adalah gunung yang terletak di {mountain.location}, "
            f"dengan ketinggian {mountain.elevation:,} mdpl. "
            "Gunung ini menawarkan pemandangan alam yang memukau dengan ekosistem yang kaya. "
            "Jalur pendakiannya melewati hutan tropis yang rimbun, padang edelweis, "
            "hingga puncak dengan panorama 360 derajat yang spektakuler. "
            "Destinasi favorit para pendaki dari seluruh nusantara yang ingin "
            "menikmati keindahan alam pegunungan Indonesia."
        ),
        "mountain_type": mountain_type,
        "volcano_status": volcano_status,
        "vegetation": vegetation,
        "basecamp_name": basecamp_name,
        "basecamp_elevation_m": basecamp_elevation,
        "permitted_status": permitted,
        "first_ascent_year": rng.randint(1920, 1980),
        "permit_required": mountain_id % 3 != 0,
        "phone_emergency": f"0{rng.randint(811,899)}-{rng.randint(1000,9999)}-{rng.randint(1000,9999)}",
    }
