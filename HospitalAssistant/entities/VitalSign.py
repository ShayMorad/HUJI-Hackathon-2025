"""
VitalSign Entity

Represents a single vital‐sign measurement for a patient.
Provides:
  - is_within_normal_range()
  - trend()
"""

from typing import Tuple


class VitalSign:
    """
    Attributes:
        timestamp (str): ISO8601 timestamp of the measurement.
        type (str): e.g. 'BP', 'HR', 'SpO2'.
        value (float): Numeric reading.
    """

    def __init__(self, timestamp: str, type: str, value: float):
        self.timestamp = timestamp
        self.type = type
        self.value = value

    def is_within_normal_range(self) -> bool:
        """
        Check if 'value' falls within a predefined clinical range.
        Returns True if normal or if no range is defined.
        """
        ranges = {'BP': (81, 120), 'HR': (60, 100), 'SpO2': (95, 100)}
        low, high = ranges.get(self.type, (None, None))
        if low is None:
            return True
        return low <= self.value <= high

    def trend(self, window: int) -> float:
        """
        Stub: compute the trend (e.g. slope) over the last `window` measurements.
        """
        # TODO: implement time‐series trend analysis
        pass
