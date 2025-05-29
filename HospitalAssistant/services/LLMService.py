"""
LLMService

A specialized service for medical-focused interactions using Google's Gemini AI models.
Provides:
  - summarize_clinical_notes()
  - generate_justification()
  - translate()
  - chat()
  - load_model()
  - health_check()
"""
import logging
logger = logging.getLogger("uvicorn.error")
import google.generativeai as genai
from google.oauth2 import service_account
from typing import Dict, Any, List
import os

class LLMService:
    # Available Gemini models with descriptions
    AVAILABLE_MODELS = {
        "gemini-1.5-flash": "Fast and versatile (recommended for general medical queries)",
        "gemini-1.5-pro": "Complex medical reasoning tasks",
        "gemini-2.0-flash": "Newest multimodal, fastest response time",
        "gemini-2.0-flash-lite": "Most cost-efficient for basic medical tasks",
        "gemini-2.5-flash-preview-05-20": "Best price-performance with medical thinking capabilities",
        "gemini-2.5-pro-preview-05-06": "Most powerful for complex medical reasoning"
    }

    def __init__(self, model_name: str = "gemini-1.5-flash"):
        """Initialize the LLM service with Gemini.

        Args:
            model_name: The Gemini model to use. Defaults to gemini-1.5-pro for medical tasks.
        """
        self._initialize_gemini(model_name)

    def _initialize_gemini(self, model_name: str):
        """Initialize Gemini with the specified model."""
        if model_name not in self.AVAILABLE_MODELS:
            raise ValueError(f"Invalid model. Available models: {list(self.AVAILABLE_MODELS.keys())}")

        try:
            # Initialize credentials from the service account file
            credentials = service_account.Credentials.from_service_account_file(
                r'C:\Users\shaym\Desktop\ComputerScience\Hackathon\Project\HUJI-Hackathon-2025\Gemini\hackathon-team-46_gen-lang-client-0325865525_iam_gserviceaccount_com_1747758552.json'
            )
            genai.configure(credentials=credentials)

            # Initialize model and chat
            self.model = genai.GenerativeModel(model_name)
            self._chat_session = self.model.start_chat(history=[])
            self.model_name = model_name
        except Exception as e:
            raise Exception(f"Failed to initialize Gemini: {e}")

    def summarize_clinical_notes(self, notes: str) -> str:
        """Summarize clinical notes using medical context-aware prompting."""
        prompt = """
        Please provide a concise medical summary of the following clinical notes. 
        Focus on key diagnoses, treatments, and important clinical observations.
        Use professional medical terminology where appropriate.
        
        Clinical Notes:
        {notes}
        """.format(notes=notes)

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Error summarizing clinical notes: {e}")

    def generate_justification(self, data: Dict[str, Any]) -> str:
        """Generate medical justification based on provided clinical data."""
        prompt = """
        Based on the following clinical data, generate a detailed medical justification.
        Include:
        - Clinical reasoning
        - Evidence-based support
        - Relevant medical guidelines
        - Risk-benefit analysis if applicable
        
        Clinical Data:
        {data}
        """.format(data=str(data))

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Error generating justification: {e}")

    def translate(self, message: str, target_language: str) -> str:
        """Translate medical content while preserving medical terminology."""
        prompt = """
        Translate the following medical text to {language}.
        Maintain medical terminology accuracy and professional tone.
        Preserve any technical terms in their standard medical form.
        
        Text to translate:
        {message}
        """.format(language=target_language, message=message)

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Error in translation: {e}")

    import logging
    logger = logging.getLogger("uvicorn.error")

    def chat(self, context: Dict[str, Any], prompt: str, language: str) -> str:
        """Engage in medical conversation with context awareness and better error visibility."""
        formatted_context = self._format_medical_context(context)

        try:
            # ------------------------------------------------------------------
            # 1)  Log what we’re about to send
            # ------------------------------------------------------------------
            logger.info("🩺 Gemini prompt: %s", prompt)
            logger.debug("Context sent: %s", formatted_context)

            # ------------------------------------------------------------------
            # 2)  Send context once per session (if any)
            # ------------------------------------------------------------------
            if formatted_context:
                self._chat_session.send_message(
                    f"Medical Context:\n{formatted_context}\n\n"
                    "Please consider this context for the conversation."
                )

            # ------------------------------------------------------------------
            # 3)  Send user prompt
            # ------------------------------------------------------------------
            raw = self._chat_session.send_message(f"User ({language}): {prompt}")
            logger.debug("Gemini raw response: %r", raw)

            # ------------------------------------------------------------------
            # 4)  Extract text robustly
            # ------------------------------------------------------------------
            if hasattr(raw, "text") and raw.text:
                return raw.text

            # Gemini 1.5+ sometimes returns candidates
            if getattr(raw, "candidates", None):
                try:
                    return raw.candidates[0].content.parts[0].text
                except Exception:
                    pass  # fall through to error below

            raise ValueError("Gemini returned empty or unknown format")

        except Exception as e:
            # ------------------------------------------------------------------
            # 5)  Log full traceback and re-raise **real** error
            # ------------------------------------------------------------------
            logger.exception("Gemini chat failed")
            raise  # let FastAPI propagate real message/traceback

    def load_model(self, model_name: str):
        """Load a different Gemini model."""
        self._initialize_gemini(model_name)

    def health_check(self) -> bool:
        """Verify the Gemini endpoint is reachable and functioning."""
        try:
            response = self.model.generate_content("System health check.")
            return response is not None and response.text != ""
        except Exception:
            return False

    def get_available_models(self) -> Dict[str, str]:
        """Get list of available Gemini models with descriptions."""
        return self.AVAILABLE_MODELS.copy()

    def _format_medical_context(self, context: Dict[str, Any]) -> str:
        """Format medical context for better Gemini understanding."""
        formatted_parts = []

        # Format different types of medical context
        if 'patient_history' in context:
            formatted_parts.append(f"Patient History:\n{context['patient_history']}")

        if 'current_condition' in context:
            formatted_parts.append(f"Current Condition:\n{context['current_condition']}")

        if 'medications' in context:
            formatted_parts.append(f"Current Medications:\n{context['medications']}")

        if 'allergies' in context:
            formatted_parts.append(f"Allergies:\n{context['allergies']}")

        if 'vital_signs' in context:
            formatted_parts.append(f"Vital Signs:\n{context['vital_signs']}")

        return "\n\n".join(formatted_parts)