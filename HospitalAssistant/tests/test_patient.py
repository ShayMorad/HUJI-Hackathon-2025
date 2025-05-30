from HospitalAssistant.entities.Patient import demo_patient_stub
from HospitalAssistant.entities.SocialProfile import SocialProfile


def test_risk_score_social_penalty():
    """Patient without social support should get +0.10 penalty."""
    p = demo_patient_stub()
    p.social_profile = SocialProfile(
        living_situation="alone",
        caregiver_available=False,
        home_address="",
    )
    score = p.compute_risk_score()
    assert score >= 0.10, "social-risk penalty not applied"


def test_risk_score_abnormal_vitals():
    """Abnormal vital adds +0.10 per sign (max 3)."""
    p = demo_patient_stub()
    # add an abnormal HR vital
    p.vitals.append(
        p.vitals[0].__class__(
            timestamp="2025-05-29T09:00:00Z",
            type="HR",
            value=140,  # outside 60–100
        )
    )
    score = p.compute_risk_score()
    assert score >= 0.10
