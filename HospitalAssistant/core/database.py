import json, pathlib
from entities.Hospital import Hospital
from entities.Ward import Ward
from entities.Patient import demo_patient_stub

DATA = pathlib.Path("./data/demo_hospital.json")

def _default_demo_object() -> Hospital:
    h = Hospital("H-001", "City General")
    w = Ward("A1", "Internal Med A", 20)
    w.admit(demo_patient_stub("P-001"))
    h.add_ward(w)
    return h

def load_hospital() -> Hospital:
    if not DATA.exists():
        return _default_demo_object()
    with DATA.open() as f:
        blob = json.load(f)
    # deserialize into Hospital/Ward/Patient quickly:
    from HospitalAssistant.entities.Hospital import Hospital
    return Hospital(**blob)            # dataclass constructor

def save_hospital(hospital: Hospital) -> None:
    DATA.parent.mkdir(exist_ok=True)
    DATA.write_text(json.dumps(hospital.to_dict(), indent=2))
