"""
SocialProfile Entity

Captures social determinants relevant to discharge planning.
Provides:
  - is_socially_ready()
  - needs_social_work_referral()
  - get_support_contacts()
"""

from typing import List


class SocialProfile:
    """
    Attributes:
        living_situation (str): e.g. 'alone', 'family'.
        caregiver_available (bool)
        home_address (str)
    """

    def __init__(self, living_situation: str, caregiver_available: bool, home_address: str):
        self.living_situation = living_situation
        self.caregiver_available = caregiver_available
        self.home_address = home_address

    def is_socially_ready(self) -> bool:
        """True if patient has a valid address and caregiver support."""
        return bool(self.home_address) and self.caregiver_available

    def needs_social_work_referral(self) -> bool:
        """True if discharge criteria unmet."""
        return not self.is_socially_ready()

    def get_support_contacts(self) -> List[str]:
        """Retrieve emergency or caregiver contacts."""
        # TODO: integrate with social‐services API
        pass
