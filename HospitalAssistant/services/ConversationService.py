"""
ConversationService

Manages patient‐facing chat:
  - translate_message()
  - generate_patient_response()
  - start/end sessions
  - get_conversation_history()
"""

from typing import List, Dict, Any
from services.LLMService import LLMService
from entities.Patient import Patient


class ConversationService:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    def translate_message(self, message: str, target_language: str) -> str:
        """Translate arbitrary text into the patient's preferred language."""
        return self.llm_service.translate(message, target_language)

    def generate_patient_response(self, patient: Patient, prompt: str) -> str:
        """Generate a context‐aware reply for the patient."""
        context = {
            'patient_info': patient.__dict__,
            'notes': patient.record.notes if patient.record else ''
        }
        return self.llm_service.chat(context, prompt, patient.preferred_language)

    def start_conversation(self, patient: Patient) -> str:
        """Initialize a chat session and return a session ID."""
        # TODO
        pass

    def get_conversation_history(self, session_id: str) -> List[str]:
        """Retrieve past messages in a chat session."""
        # TODO
        pass

    def end_conversation(self, patient: Patient):
        """Clean up any stored session context."""
        # TODO
        pass
