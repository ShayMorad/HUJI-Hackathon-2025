from pydantic import BaseModel
from typing import List

class WardSnapshot(BaseModel):
    ward_id: str
    name: str
    capacity: int
    occupancy: int
    load_factor: float
    is_overloaded: bool
    average_risk: float
    patients: List[str]

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
