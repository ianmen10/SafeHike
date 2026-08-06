import google.generativeai as genai
from app.ai.providers.base_provider import BaseAIProvider
from app.core.config import settings

class GeminiProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # Kita menggunakan model yang cepat dan efisien
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    async def generate_text(self, prompt: str, system_instruction: str = None) -> str:
        if not self.model:
            # Fallback jika API key belum diset, development jalan terus
            return "MOCK_AI_RESPONSE: (API Key Gemini belum diset). Ini adalah data simulasi dari AI."
        
        try:
            # Jika system_instruction diperlukan di model Gemini 1.5,
            # bisa dilempar saat inisialisasi model, atau ditaruh di prompt
            if system_instruction:
                prompt = f"System Instruction: {system_instruction}\n\nUser Prompt: {prompt}"

            response = await self.model.generate_content_async(contents=prompt)
            return response.text
        except Exception as e:
            # Error handling yang elegan agar aplikasi tidak crash
            return f"AI_ERROR: Tidak dapat memproses permintaan AI saat ini. Detail: {str(e)}"
