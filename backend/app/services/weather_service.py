from typing import Dict, Any
import random

async def get_weather_for_location(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Mock Weather Service.
    Di masa depan, fungsi ini bisa dimodifikasi menggunakan library 'httpx'
    untuk memanggil API sungguhan seperti OpenWeatherMap.
    """
    conditions = ["Cerah", "Berawan", "Hujan Ringan", "Badai", "Kabut Tebal"]
    current_condition = random.choice(conditions)
    
    # Suhu random antara 5 - 28 celcius
    temperature = round(random.uniform(5.0, 28.0), 1)
    
    # Kecepatan angin random
    wind_speed = round(random.uniform(0.0, 45.0), 1)
    
    # Logika sederhana keamanan pendakian berdasarkan cuaca
    is_safe = current_condition not in ["Badai", "Kabut Tebal"] and wind_speed < 35.0
    
    return {
        "latitude": latitude,
        "longitude": longitude,
        "condition": current_condition,
        "temperature_celsius": temperature,
        "wind_speed_kmh": wind_speed,
        "is_safe_to_hike": is_safe,
        "recommendation": "Cuaca aman untuk pendakian." if is_safe else "Sangat berbahaya! Tunda pendakian Anda."
    }
