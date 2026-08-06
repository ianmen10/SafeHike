from abc import ABC, abstractmethod

class BaseAIProvider(ABC):
    """
    Abstraksi (Interface) untuk AI Provider.
    Setiap implementasi (Google Gemini, OpenAI, Claude, dll) harus mematuhi interface ini
    agar aplikasi (business logic) tidak terikat pada satu vendor tertentu.
    """
    
    @abstractmethod
    async def generate_text(self, prompt: str, system_instruction: str = None) -> str:
        pass
