from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class VitalSignSchema(BaseModel):
    name: str       # maps to VitalSign.type
    value: float
    unit: str       # you were missing this
    timestamp: str


class SocialProfileCreate(BaseModel):
    living_situation: str  # 'alone', 'family', 'institution'
    caregiver_available: bool
    home_address: str
    profile_id: Optional[str] = None


class SocialProfileSchema(SocialProfileCreate):
    support_contacts: List[str] = []

class ChatRequest(BaseModel):
    userId: str
    userName: str
    patientId: str
    patientName: str
    message: str
    timestamp: datetime

class PromptOnly(BaseModel):
    message: str  # Accepts JSON like: { "message": "Ask about meds" }


class ChatResponse(BaseModel):
    reply: str

class PatientCreate(BaseModel):
    patient_id: str
    name: str
    age: int
    ward_id: str
    preferred_language: str
    social_profile: SocialProfileCreate
    vitals: List[VitalSignSchema] = []


class PatientDetail(PatientCreate):
    status: str
    risk_score: Optional[float] = None
    social_profile: SocialProfileSchema
    room: str
    reason: str
    assigned_staff: List[str]


class WardSnapshot(BaseModel):
    ward_id: str
    name: str
    capacity: int
    occupancy: int
    load_factor: float
    is_overloaded: bool
    average_risk: float
    patients: List[PatientDetail]  # instead of just List[str]


class HospitalSnapshot(BaseModel):
    hospital_id: str
    name: str
    total_capacity: int
    total_occupied: int
    total_free_beds: int
    utilisation: float
    average_patient_risk: float
    bottlenecks: List[WardSnapshot]
    wards: List[WardSnapshot]
