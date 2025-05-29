# entities/Hospital.py
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional

from entities.Patient import Patient
from entities.Ward import Ward


@dataclass
class Hospital:
    """
    Container for multiple wards plus high-level analytics.
    """
    hospital_id: str
    name: str
    wards: Dict[str, Ward] = field(default_factory=dict)   # keyed by ward_id

    # ------------------------------------------------------------------ #
    # CRUD on wards                                                      #
    # ------------------------------------------------------------------ #
    def list_wards(self) -> List[Ward]:
        return list(self.wards.values())

    def add_ward(self, ward: Ward) -> None:
        self.wards[ward.ward_id] = ward

    def remove_ward(self, ward_id: str) -> None:
        self.wards.pop(ward_id, None)

    def get_ward(self, ward_id: str) -> Ward | None:
        return self.wards.get(ward_id)

    def find_patient(self, patient_id: str) -> Optional[Patient]:
        for ward in self.wards.values():
            if patient_id in ward.patients:
                return ward.patients[patient_id]
        return None


    # ------------------------------------------------------------------ #
    # Analytics                                                          #
    # ------------------------------------------------------------------ #
    def total_capacity(self) -> int:
        return sum(w.capacity for w in self.wards.values())

    def total_occupancy(self) -> int:
        return sum(w.occupancy() for w in self.wards.values())

    def bed_utilisation(self) -> float:
        cap = self.total_capacity()
        return self.total_occupancy() / cap if cap else 0.0

    def get_bottlenecks(self, threshold: float = 0.8) -> List[dict]:
        """
        Return wards whose load_factor >= threshold (default 80 %).
        Each item is ward.to_dict().
        """
        return [
            w.to_dict()
            for w in self.wards.values()
            if w.load_factor() >= threshold
        ]

    def average_patient_risk(self) -> float:
        """Mean risk score across all in-patients hospital-wide."""
        pts = [p for w in self.wards.values() for p in w.list_patients()]
        return (sum(p.compute_risk_score() for p in pts) / len(pts)) if pts else 0.0

    # ------------------------------------------------------------------ #
    # Reports / serialization                                            #
    # ------------------------------------------------------------------ #
    def generate_system_report(self) -> Dict[str, Any]:
        return {
            "hospital_id": self.hospital_id,
            "name": self.name,
            "total_capacity": self.total_capacity(),
            "total_occupied": self.total_occupancy(),
            "total_free_beds": self.total_capacity() - self.total_occupancy(),
            "utilisation": round(self.bed_utilisation(), 2),
            "average_patient_risk": round(self.average_patient_risk(), 2),
            "bottlenecks": self.get_bottlenecks(),
        }

    def to_dict(self) -> dict:
        wards_data = [w.to_dict() for w in self.wards.values()]
        return {
            "hospital_id": self.hospital_id,
            "name": self.name,
            "total_capacity": self.total_capacity(),
            "total_occupied": self.total_occupancy(),
            "total_free_beds": self.total_capacity() - self.total_occupancy(),
            "utilisation": round(self.bed_utilisation(), 2),
            "average_patient_risk": round(self.average_patient_risk(), 2),
            "bottlenecks": [w.to_dict() for w in self.get_bottlenecks()],
            "wards": wards_data,
        }

    # ------------------------------------------------------------------ #
    # Future stub                                                        #
    # ------------------------------------------------------------------ #
    def optimize_resource_allocation(self) -> None:
        """
        Placeholder for advanced analytics:
        e.g. suggest moving two nurses from Ward B to Ward A.
        """
        # TODO: implement algorithm / LLM call
        pass

    # nic(er) repr
    def __repr__(self) -> str:  # noqa: D401
        return f"<Hospital {self.name} {self.total_occupancy()}/{self.total_capacity()}>"
