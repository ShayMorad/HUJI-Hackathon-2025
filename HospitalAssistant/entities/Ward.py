# entities/Ward.py  (append or replace the previous version)

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Optional
from entities.Patient import Patient


@dataclass
class Ward:
    ward_id: str
    name: str
    capacity: int
    patients: Dict[str, Patient] = field(default_factory=dict)  # keyed by patient_id

    # ---  original-mapping conveniences -----------------------------------
    def list_patients(self) -> List[Patient]:                 # NEW
        """Return a list of all current patients."""
        return list(self.patients.values())

    def get_bed_availability(self) -> int:                    # NEW
        """Number of free beds right now."""
        return max(0, self.capacity - self.occupancy())

    def generate_occupancy_report(self) -> Dict[str, any]:    # NEW stub
        """
        Return an extended report.
        Later you can add throughput, avg LOS, etc.
        """
        return self.to_dict()

    # ---  core methods from earlier draft (unchanged) ----------------------
    def admit(self, patient: Patient) -> bool:
        if self.is_full():
            return False
        self.patients[patient.patient_id] = patient
        return True

    def discharge(self, patient_id: str) -> Optional[Patient]:
        return self.patients.pop(patient_id, None)

    def occupancy(self) -> int:
        return len(self.patients)

    def load_factor(self) -> float:
        return self.occupancy() / max(self.capacity, 1)

    def is_full(self) -> bool:
        return self.occupancy() >= self.capacity

    def is_overloaded(self, threshold: float = 0.9) -> bool:
        return self.load_factor() >= threshold

    def average_risk_score(self) -> float:
        if not self.patients:
            return 0.0
        return sum(p.compute_risk_score() for p in self.patients.values()) / len(self.patients)

    def to_dict(self) -> dict:
        return {
            "ward_id": self.ward_id,
            "name": self.name,
            "capacity": self.capacity,
            "occupancy": self.occupancy(),
            "load_factor": round(self.load_factor(), 2),
            "is_overloaded": self.is_overloaded(),
            "average_risk": round(self.average_risk_score(), 2),
            "patients": [p.to_dict() for p in self.patients.values()],
        }

    @staticmethod
    def from_dict(data: dict) -> Ward:
        """
        Reconstruct a Ward object from a dictionary.
        Assumes patients are in a list of dicts under `patients`.
        """
        ward = Ward(
            ward_id=data["ward_id"],
            name=data["name"],
            capacity=data["capacity"]
        )

        # Patients are saved as full dictionaries, so parse each one
        patients_data = data.get("patients", [])
        for p_data in patients_data:
            patient = Patient.from_dict(p_data)
            ward.patients[patient.patient_id] = patient

        return ward

    def __repr__(self):
        return f"<Ward {self.name} {self.occupancy()}/{self.capacity}>"
