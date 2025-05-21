"""
Hospital Entity

Represents the hospital containing multiple wards and provides tools
for executive oversight (e.g., bottleneck detection, capacity reports).

Provides:
  - list_wards()
  - add_ward()
  - remove_ward()
  - get_bottlenecks(): identify wards near capacity or performance issues
  - generate_system_report(): summary across all wards
"""

from typing import List, Dict, Any
from entities.Ward import Ward


class Hospital:
    """
    Attributes:
        hospital_id (str): Unique identifier.
        name (str): Hospital name.
        wards (List[Ward]): List of Ward instances in this hospital.
    """

    def __init__(self, hospital_id: str, name: str, wards: List[Ward] = None):
        self.hospital_id = hospital_id
        self.name = name
        self.wards: List[Ward] = wards or []

    def list_wards(self) -> List[Ward]:
        """
        Return all wards in the hospital.
        """
        return self.wards

    def add_ward(self, ward: Ward) -> None:
        """
        Add a new ward to the hospital.
        """
        self.wards.append(ward)

    def remove_ward(self, ward_id: str) -> None:
        """
        Remove a ward by its ID.
        """
        self.wards = [w for w in self.wards if w.ward_id != ward_id]

    def get_bottlenecks(self, capacity_threshold: float = 0.8) -> List[Dict[str, Any]]:
        """
        Identify wards where occupancy >= capacity_threshold.
        Returns a list of dicts with ward_id, name, capacity, occupancy, utilization.
        """
        bottlenecks = []
        for w in self.wards:
            occupied = len(w.patients)
            if w.capacity > 0 and (occupied / w.capacity) >= capacity_threshold:
                bottlenecks.append({
                    'ward_id': w.ward_id,
                    'name': w.name,
                    'capacity': w.capacity,
                    'occupancy': occupied,
                    'utilization': occupied / w.capacity
                })
        return bottlenecks

    def generate_system_report(self) -> Dict[str, Any]:
        """
        Produce a summary report with total capacity, total occupied beds,
        free beds, and current bottlenecks.
        """
        total_capacity = sum(w.capacity for w in self.wards)
        total_occupied = sum(len(w.patients) for w in self.wards)
        report = {
            'hospital_id': self.hospital_id,
            'name': self.name,
            'total_capacity': total_capacity,
            'total_occupied': total_occupied,
            'total_free_beds': total_capacity - total_occupied,
            'bottlenecks': self.get_bottlenecks()
        }
        return report

    # Future stub
    def optimize_resource_allocation(self) -> None:
        """
        Analyze utilization and suggest resource redistribution.
        """
        # TODO: implement advanced analytics
        pass
