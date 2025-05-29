# entities/MedicalRecord.py
from dataclasses import dataclass, field
from typing import List, Dict, Any


@dataclass
class MedicalRecord:
    diagnosis: str = ""
    notes: List[str] = field(default_factory=list)
    lab_results: Dict[str, Any] = field(default_factory=dict)

    # ------------------------------------------------------------------
    # LLM hooks – will be wired to Gemini later
    # ------------------------------------------------------------------
    def summarize_history(self) -> str:
        """
        TODO: replace placeholder with:
            from services import LLMService
            return LLMService.summarize_clinical_notes("\n".join(self.notes))
        """
        return "TODO: call LLM for summary"

    def generate_justification(self, data: Dict[str, Any]) -> str:
        """
        TODO: replace placeholder with an LLM explanation.
        """
        return "TODO: call LLM for justification"

    # Existing stubs you may fill later
    def flag_critical_labs(self):  # -> List[str]
        return []

    def get_lab_trends(self, test_code: str):  # -> List[Any]
        return []
