"""
Patient Entity

Aggregates demographics, vitals, medical record, language, and social profile.
Provides:
  - get_current_vitals()
  - update_status()
  - load_full_history()
  - compute_risk_score()
  - refresh_data()
"""

from typing import List
import VitalSign
import MedicalRecord
import SocialProfile


class Patient:
    """
    Attributes:
        patient_id (str)
        name (str)
        age (int)
        ward_id (str)
        preferred_language (str)
        social_profile (SocialProfile)
        vitals (List[VitalSign])
        record (MedicalRecord)
    """

    def __init__(self, patient_id: str, name: str, age: int, ward_id: str, preferred_language: str,
                 social_profile: SocialProfile):
        self.patient_id = patient_id
        self.name = name
        self.age = age
        self.ward_id = ward_id
        self.preferred_language = preferred_language
        self.social_profile = social_profile
        self.vitals: List[VitalSign] = []
        self.record: MedicalRecord = None

    def get_current_vitals(self) -> List[VitalSign]:
        """Return the latest vital readings."""
        return self.vitals

    def update_status(self) -> str:
        """
        Return 'stable' if all vitals normal, otherwise 'unstable'.
        """
        issues = [v for v in self.vitals if not v.is_within_normal_range()]
        return 'unstable' if issues else 'stable'

    def load_full_history(self):
        """Fetch and populate `self.record` and `self.vitals` via EMRConnector."""
        # TODO
        pass

    def compute_risk_score(self) -> float:
        """Compute a composite risk score from vitals, labs, and social context."""
        # TODO
        pass

    def refresh_data(self):
        """Force reload of all patient data from EMR."""
        # TODO
        pass
