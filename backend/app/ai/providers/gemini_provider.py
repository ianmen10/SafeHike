import google.generativeai as genai
from app.ai.providers.base_provider import BaseAIProvider
from app.core.config import settings

class GeminiProvider(BaseAIProvider):
    FALLBACK_MODELS = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.5-flash"]

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = getattr(settings, "GEMINI_MODEL", "gemini-3.6-flash")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None

    async def generate_text(self, prompt: str, system_instruction: str = None) -> str:
        if not self.api_key:
            # Fallback jika API key belum diset, development jalan terus
            return "MOCK_AI_RESPONSE: (API Key Gemini belum diset). Ini adalah data simulasi dari AI."
        
        formatted_prompt = (
            f"System Instruction: {system_instruction}\n\nUser Prompt: {prompt}"
            if system_instruction
            else prompt
        )

        models_to_try = [self.model_name] + [m for m in self.FALLBACK_MODELS if m != self.model_name]
        last_error = None

        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = await model.generate_content_async(contents=formatted_prompt)
                return response.text
            except Exception as e:
                last_error = e

        return f"AI_ERROR: Tidak dapat memproses permintaan AI saat ini. Detail: {str(last_error)}"
