"""
Patient Entity
Aggregates demographics, vitals, medical record, language, and social profile.

Key public methods
------------------
get_current_vitals()      -> List[VitalSign]
update_status()           -> 'stable' | 'unstable'
load_full_history()       -> None  (populates self.vitals / self.record)
compute_risk_score()      -> float (0-1)
refresh_data()            -> None  (force-reload from EMR)

The heavy lifting (I/O and LLM) is delegated to services,
so this class stays pure-Python and testable.
"""

from __future__ import annotations
from typing import List, Optional

from services.EMRConnector import EMRConnector
from entities.VitalSign import VitalSign
from entities.MedicalRecord import MedicalRecord
from entities.SocialProfile import SocialProfile


class Patient:
    """Domain object representing a single hospitalised patient."""

    # --- ctor ----------------------------------------------------------------
    def __init__(
        self,
        patient_id: str,
        name: str,
        age: int,
        ward_id: str,
        preferred_language: str,
        social_profile: Optional[SocialProfile] = None,
    ):
        self.patient_id = patient_id
        self.name = name
        self.age = age
        self.ward_id = ward_id
        self.preferred_language = preferred_language
        self.social_profile = social_profile or SocialProfile.default()

        self.vitals: List[VitalSign] = []          # populated via load_full_history()
        self.record: Optional[MedicalRecord] = None

    # ------------------------------------------------------------------------
    # Simple getters
    # ------------------------------------------------------------------------
    def get_current_vitals(self) -> List[VitalSign]:
        """Return the most recent vital-sign readings."""
        return self.vitals

    # ------------------------------------------------------------------------
    # Derived helpers
    # ------------------------------------------------------------------------
    def update_status(self) -> str:
        """
        Return 'stable' if every vital sign lies within the normal range,
        otherwise 'unstable'.
        """
        abnormal = [v for v in self.vitals if not v.is_within_normal_range()]
        return "unstable" if abnormal else "stable"

    # ------------------------------------------------------------------------
    # Data-loading helpers
    # ------------------------------------------------------------------------
    def load_full_history(self) -> None:
        """
        Fetch **all** patient data (vitals + EMR notes) from the EMRConnector
        and populate the object's fields.
        """
        emr_data = EMRConnector.fetch_patient_snapshot(self.patient_id)

        # Expecting the connector to hand back dicts we can hydrate into objects
        self.vitals = [VitalSign(**vs) for vs in emr_data["vitals"]]
        self.record = MedicalRecord(**emr_data["record"])

    def refresh_data(self) -> None:
        """
        Force a re-pull from the EMR (could be throttled/cached inside EMRConnector).
        Useful for real-time demo button: 'Refresh'.
        """
        self.load_full_history()

    # ------------------------------------------------------------------------
    # Risk scoring (demo heuristic)
    # ------------------------------------------------------------------------
    def compute_risk_score(self) -> float:
        """
        Very lightweight heuristic for demo purposes.

        • +0.15 if patient > 75
        • +0.10 per abnormal vital sign (up to 3)
        • +0.10 if social profile still needs a social-work referral
        • Clamp to [0, 1]
        """
        score = 0.0

        # age penalty
        if self.age > 75:
            score += 0.15

        # vitals penalty
        abnormal_count = sum(
            not v.is_within_normal_range() for v in self.vitals[:3]
        )
        score += 0.10 * abnormal_count

        # new: social-readiness penalty
        if self.social_profile and self.social_profile.needs_social_work_referral():
            score += 0.10

        return min(score, 1.0)


# ---------------------------------------------------------------------------
# Quick factory for unit-test / demo convenience
# ---------------------------------------------------------------------------
from datetime import datetime, timezone
from entities.SocialProfile import SocialProfile

def demo_patient_stub(pid: str = "P-001") -> Patient:
    """
    Return a ready-to-use Patient with:
      • normal vitals (BP, HR, SpO2)
      • empty medical record
      • neutral social profile
    """
    now = datetime.now(timezone.utc).isoformat()  # ISO-8601 with “Z”

    patient = Patient(
        patient_id=pid,
        name="John Doe",
        age=63,
        ward_id="A1",
        preferred_language="en",
        social_profile=SocialProfile.default(),
    )

    patient.vitals = [
        VitalSign(timestamp=now, type="BP",   value=110),   # systolic
        VitalSign(timestamp=now, type="HR",   value=72),
        VitalSign(timestamp=now, type="SpO2", value=98),
    ]

    patient.record = MedicalRecord(diagnosis="Pneumonia", notes=[])
    return patient
