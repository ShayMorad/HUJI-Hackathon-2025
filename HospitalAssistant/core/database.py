import json, pathlib
from typing import List

from entities.Hospital import Hospital
from entities.VitalSign import VitalSign
from entities.Ward import Ward
from entities.Patient import demo_patient_stub, Patient

DATA = pathlib.Path("./data/hospital_demo_balanced_fixed.json")


def _default_demo_object() -> Hospital:
    h = Hospital("H-001", "City General")
    w = Ward("A1", "Internal Med A", 20)
    w.admit(demo_patient_stub("P-001"))
    h.add_ward(w)
    return h


def load_hospital() -> Hospital:
    import json
    with open("data/hospital_demo_balanced_fixed.json") as f:
        blob = json.load(f)

    # Reconstruct wards from list -> dict
    ward_dict = {
        w_data["ward_id"]: Ward.from_dict(w_data)
        for w_data in blob["wards"]
    }

    return Hospital(
        hospital_id=blob["hospital_id"],
        name=blob["name"],
        wards=ward_dict
    )


def save_hospital(hospital: Hospital) -> None:
    DATA.parent.mkdir(exist_ok=True)
    DATA.write_text(json.dumps(hospital.to_dict(), indent=2))


def add_patient_to_ward(hospital: Hospital, ward_id: str, patient: Patient) -> bool:
    ward = hospital.wards.get(ward_id)
    if not ward:
        raise ValueError(f"Ward {ward_id} not found.")
    return ward.admit(patient)


def discharge_patient(hospital: Hospital, patient_id: str) -> bool:
    for ward in hospital.wards.values():
        if patient_id in ward.patients:
            ward.discharge(patient_id)
            return True
    return False


def update_patient_vitals(hospital: Hospital, patient_id: str, vitals: List[VitalSign]):
    patient = hospital.find_patient(patient_id)
    if patient:
        patient.vitals = vitals
