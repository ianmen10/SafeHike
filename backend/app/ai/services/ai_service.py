from app.ai.providers.gemini_provider import GeminiProvider
from app.ai.prompts.system_prompts import TRIP_PLANNER_SYSTEM_PROMPT
from app.ai.schemas.ai_schemas import AIRecommendationRequest, AIRecommendationResponse

class AIService:
    """
    Facade Layer: Router API hanya perlu memanggil kelas ini,
    tanpa perlu tahu provider mana yang sedang bekerja di latar belakang.
    """
    def __init__(self):
        # Menginisiasi provider aktif. Sangat mudah diganti tanpa merusak router.
        self.provider = GeminiProvider()

    async def get_hike_recommendation(self, req: AIRecommendationRequest) -> AIRecommendationResponse:
        prompt = (
            f"Saya berencana mendaki gunung {req.mountain_name} lewat jalur {req.trail_name}.\n"
            f"Tingkat pengalaman saya: {req.user_experience_level}.\n"
            f"Kondisi cuaca saat ini: {req.weather_condition} dengan suhu {req.temperature_celsius} derajat Celcius.\n"
            f"Berikan rekomendasi peralatan yang relevan dan peringatan keamanan spesifik untuk saya."
        )
        
        # Mengeksekusi panggilan AI ke provider
        response_text = await self.provider.generate_text(
            prompt=prompt,
            system_instruction=TRIP_PLANNER_SYSTEM_PROMPT
        )
        
        return AIRecommendationResponse(recommendation_text=response_text)

# Export singleton instance
ai_service = AIService()
