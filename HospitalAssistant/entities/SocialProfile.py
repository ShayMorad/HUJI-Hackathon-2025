"""
SocialProfile Entity
Captures social determinants relevant to discharge planning.

Key methods
-----------
is_socially_ready()          -> bool
needs_social_work_referral() -> bool
get_support_contacts()       -> List[str]
to_dict()                    -> dict
"""

from __future__ import annotations
from dataclasses import dataclass, asdict
from typing import List, Optional

# ---------------------------------------------------------------------------
# Mock social-services connector (demo stub)
# ---------------------------------------------------------------------------
class SocialServicesAPI:
    """Tiny stub that would hit a real service in production."""
    _DB = {
        "555-12-ALONE": ["Sister: +972-52-123-4567"],
        "555-34-FAMILY": ["Spouse: +972-50-987-6543", "Son: +972-54-555-1111"],
    }

    @classmethod
    def fetch_contacts(cls, profile_id: str) -> List[str]:
        return cls._DB.get(profile_id, [])


# ---------------------------------------------------------------------------
# Main dataclass
# ---------------------------------------------------------------------------
@dataclass
class SocialProfile:
    living_situation: str            # 'alone', 'family', 'institution'
    caregiver_available: bool
    home_address: str
    profile_id: Optional[str] = None     # used by SocialServicesAPI stub

    # ----------------------------------------------------------------------
    # Business logic
    # ----------------------------------------------------------------------
    def is_socially_ready(self) -> bool:
        """
        Discharge-ready from a *social* standpoint if:
        • the patient has a usable address, AND
        • a caregiver is available OR they do not live alone.
        """
        has_address = bool(self.home_address.strip())
        has_support = self.caregiver_available or self.living_situation != "alone"
        return has_address and has_support

    def needs_social_work_referral(self) -> bool:
        """True when social discharge criteria are **not** met."""
        return not self.is_socially_ready()

    def get_support_contacts(self) -> List[str]:
        """
        Retrieve emergency / caregiver phone numbers.

        In demo mode we call a stubbed service; in real life this might
        query the hospital’s social-work system.
        """
        if not self.profile_id:
            return []
        return SocialServicesAPI.fetch_contacts(self.profile_id)

    # ----------------------------------------------------------------------
    # Convenience
    # ----------------------------------------------------------------------
    def to_dict(self) -> dict:
        return asdict(self)

    @staticmethod
    def default() -> "SocialProfile":
        """Return a neutral profile (used by Patient factory stubs)."""
        return SocialProfile(
            living_situation="unknown",
            caregiver_available=False,
            home_address="",
            profile_id=None,
        )

    # nicer repr for debugging
    def __repr__(self) -> str:  # noqa: D401
        status = "ready" if self.is_socially_ready() else "needs-referral"
        return f"<SocialProfile {status} ({self.living_situation})>"
