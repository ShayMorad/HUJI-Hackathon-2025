"""
Ward Entity

Models a hospital ward with capacity and a list of patients.
Provides:
  - list_patients()
  - add_patient()
  - remove_patient()
  - get_bed_availability()
  - generate_occupancy_report()
"""

from typing import List, Dict, Any
from entities.Patient import Patient


class Ward:
    """
    Attributes:
        ward_id (str)
        name (str)
        capacity (int)
        patients (List[Patient])
    """

    def __init__(self, ward_id: str, name: str, capacity: int):
        self.ward_id = ward_id
        self.name = name
        self.capacity = capacity
        self.patients: List[Patient] = []

    def list_patients(self) -> List[Patient]:
        """Return all current patients."""
        return self.patients

    def add_patient(self, patient: Patient) -> None:
        """Add patient if capacity allows, else raise."""
        if len(self.patients) >= self.capacity:
            raise ValueError("Ward at full capacity")
        self.patients.append(patient)

    def remove_patient(self, patient_id: str) -> None:
        """Discharge/remove a patient by ID."""
        self.patients = [p for p in self.patients if p.patient_id != patient_id]

    def get_bed_availability(self) -> int:
        """Return number of free beds."""
        return max(0, self.capacity - len(self.patients))

    def generate_occupancy_report(self) -> Dict[str, Any]:
        """Produce stats on occupancy, throughput, etc."""
        # TODO
        pass
