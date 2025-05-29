"""
VitalSign Entity
Represents a single vital-sign measurement for a patient.

Key methods
-----------
is_within_normal_range()  -> bool
trend(history)            -> float  # slope per minute
to_dict()                 -> dict
"""

from __future__ import annotations
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Tuple

# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------
_NORMAL_RANGES: dict[str, Tuple[float, float]] = {
    "BP": (80, 120),   # systolic
    "HR": (60, 100),
    "SpO2": (95, 100),
}


def _parse_iso(ts: str) -> datetime:
    """Fast ISO-8601 parser (YYYY-MM-DDTHH:MM:SS)."""
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))


# ------------------------------------------------------------
# Main dataclass
# ------------------------------------------------------------
@dataclass
class VitalSign:
    timestamp: str   # ISO-8601 (stored as string for easy JSON)
    type: str        # 'BP', 'HR', 'SpO2', ...
    value: float
    unit: str

    # ------------------------------------------------------------------
    # Business logic
    # ------------------------------------------------------------------
    def is_within_normal_range(self) -> bool:
        """
        True  -> reading within clinical reference range
        False -> outside range (could be low or high)
        If the vital type is unknown, we conservatively return True so the
        rest of the pipeline doesn’t raise.
        """
        bounds = _NORMAL_RANGES.get(self.type)
        if bounds is None:
            return True
        low, high = bounds
        return low <= self.value <= high

    def trend(self, history: List["VitalSign"]) -> float:
        """
        Rough slope (Δvalue / Δminutes) over recent *history* of the **same**
        vital-sign type. A positive slope means values are trending up.

        Parameters
        ----------
        history : List[VitalSign]
            MUST contain the *older* records of the same `type`.
            (self is assumed to be the newest measurement.)

        Returns
        -------
        slope_per_min : float
            NaN if there is fewer than 2 points or mismatched types.
        """
        # Filter only the same type
        series = [v for v in history if v.type == self.type] + [self]
        if len(series) < 2:
            return float("nan")

        # Sort by timestamp
        series.sort(key=lambda v: v.timestamp)

        # Compute simple linear regression slope (Ordinary Least Squares)
        # over time in minutes.
        t0 = _parse_iso(series[0].timestamp)
        xs, ys = [], []
        for v in series:
            delta_min = (_parse_iso(v.timestamp) - t0).total_seconds() / 60.0
            xs.append(delta_min)
            ys.append(v.value)

        n = len(xs)
        mean_x = sum(xs) / n
        mean_y = sum(ys) / n
        ss_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
        ss_xx = sum((x - mean_x) ** 2 for x in xs)

        if ss_xx == 0:
            return 0.0
        slope = ss_xy / ss_xx      # units: value change per minute
        return slope

    # ------------------------------------------------------------------
    # Convenience
    # ------------------------------------------------------------------
    def to_dict(self) -> dict:
        return {
            "name": self.type,
            "value": self.value,
            "unit": self.unit,  # ← NEW
            "timestamp": self.timestamp
        }

    @classmethod
    def from_schema(cls, schema: "VitalSignSchema"):
        return cls(
            timestamp=schema.timestamp,
            type=schema.name,
            value=schema.value,
            unit=schema.unit,
        )

    # Nice repr for debugging
    def __repr__(self) -> str:  # noqa: D401
        return f"<VitalSign {self.type}={self.value} @ {self.timestamp}>"
