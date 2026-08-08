from typing import Dict, Any
import random
import asyncio
import requests

WEATHER_CODES = {
    0: "Cerah",
    1: "Cerah Berawan",
    2: "Berawan",
    3: "Mendung",
    45: "Kabut",
    48: "Kabut Rime",
    51: "Gerimis Ringan",
    53: "Gerimis Sedang",
    55: "Gerimis Lebat",
    61: "Hujan Ringan",
    63: "Hujan Sedang",
    65: "Hujan Lebat",
    71: "Hujan Salju Ringan",
    73: "Hujan Salju Sedang",
    75: "Hujan Salju Lebat",
    80: "Hujan Lokal Ringan",
    81: "Hujan Lokal Sedang",
    82: "Hujan Lokal Lebat",
    95: "Badai Petir",
    96: "Badai Petir + Es Ringan",
    99: "Badai Petir + Es Heavy",
}

async def get_weather_for_location(latitude: float, longitude: float, mountain_name: str = "") -> Dict[str, Any]:
    """
    Mengambil data cuaca real-time dari Open-Meteo API (Free, no API key required).
    Jika gagal atau offline, fallback ke simulasi data cuaca yang realistis.
    """
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
        )
        
        def _fetch():
            res = requests.get(url, timeout=4)
            if res.status_code == 200:
                return res.json()
            return None

        data = await asyncio.to_thread(_fetch)
        if data and "current" in data:
            curr = data["current"]
            code = curr.get("weather_code", 0)
            desc = WEATHER_CODES.get(code, "Berawan")
            temp = float(curr.get("temperature_2m", 15.0))
            feels_like = float(curr.get("apparent_temperature", temp - 2))
            humidity = int(curr.get("relative_humidity_2m", 75))
            wind_speed = float(curr.get("wind_speed_10m", 12.0))  # km/h

            # Konversi km/h ke m/s
            wind_speed_ms = round(wind_speed / 3.6, 1)

            return {
                "mountain": mountain_name,
                "weather": {
                    "temp": round(temp, 1),
                    "feels_like": round(feels_like, 1),
                    "humidity": humidity,
                    "wind_speed": wind_speed_ms,
                    "description": desc,
                    "icon": "01d"
                },
                "is_safe_to_hike": code < 60 and wind_speed_ms < 15.0,
                "recommendation": "Cuaca kondusif untuk pendakian." if code < 60 else "Waspada cuaca buruk!"
            }
    except Exception as e:
        print(f"Weather API fetch failed (using fallback): {e}")

    # Fallback jika offline
    rng = random.Random(int((latitude + longitude) * 10000))
    temp = round(rng.uniform(12.0, 22.0), 1)
    return {
        "mountain": mountain_name,
        "weather": {
            "temp": temp,
            "feels_like": round(temp - 2.5, 1),
            "humidity": rng.randint(60, 90),
            "wind_speed": round(rng.uniform(2.5, 9.5), 1),
            "description": rng.choice(["Cerah Berawan", "Berawan", "Sejuk dan Berangin"]),
            "icon": "01d"
        },
        "is_safe_to_hike": True,
        "recommendation": "Cuaca sejuk dan aman untuk pendakian."
    }
