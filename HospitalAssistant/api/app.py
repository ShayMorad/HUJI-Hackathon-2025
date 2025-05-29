from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from core.database import (
    load_hospital,
    save_hospital,
    add_patient_to_ward,
    discharge_patient,
    update_patient_vitals,
)
from core.schemas import (
    HospitalSnapshot,
    WardSnapshot,
    PatientDetail,
    PatientCreate,
    VitalSignSchema, ChatResponse, ChatRequest,
)
from entities.VitalSign import VitalSign
app = FastAPI(title="MedAssist AI Backend")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# singleton in-memory hospital object for the demo
hospital = load_hospital()


# ---------- Hospital-level ----------
@app.get("/hospital", response_model=HospitalSnapshot)
def get_hospital():
    return hospital.to_dict()


# ---------- Ward-level ----------
@app.get("/wards/{ward_id}", response_model=WardSnapshot)
def ward_status(ward_id: str):
    ward = hospital.get_ward(ward_id)
    if not ward:
        raise HTTPException(404)
    return ward.to_dict()


@app.post("/wards/{ward_id}/patients/{pid}/predict_discharge")
def predict_discharge(ward_id: str, pid: str):
    ward = hospital.get_ward(ward_id)
    if not ward or pid not in ward.patients:
        raise HTTPException(404)
    patient = ward.patients[pid]
    # simple rule-based readiness
    ready = patient.compute_risk_score() < 0.3
    return {"ready": ready, "confidence": round(1 - patient.compute_risk_score(), 2)}

# ---------- Patient-level ----------
@app.get("/patients/{pid}", response_model=PatientDetail)
def get_patient(pid: str):
    patient = hospital.find_patient(pid)
    if not patient:
        raise HTTPException(404)
    return patient.to_dict()


@app.post("/patients", status_code=201)
def add_patient(patient_data: PatientCreate):
    from entities.Patient import Patient
    patient = Patient(
        patient_id=patient_data.patient_id,
        name=patient_data.name,
        age=patient_data.age,
        ward_id=patient_data.ward_id,
        preferred_language=patient_data.preferred_language,
        social_profile=patient_data.social_profile,
    )
    patient.vitals = patient_data.vitals
    success = add_patient_to_ward(hospital, patient_data.ward_id, patient)
    if not success:
        raise HTTPException(400, detail="Ward is full or not found")
    return {"status": "added"}

@app.put("/patients/{pid}/vitals")
def update_vitals(pid: str, vitals: List[VitalSignSchema]):
    update_patient_vitals(hospital, pid, [VitalSign(**v.dict()) for v in vitals])
    return {"status": "updated"}


@app.delete("/patients/{pid}")
def remove_patient(pid: str):
    if not discharge_patient(hospital, pid):
        raise HTTPException(404)
    return {"status": "discharged"}

@app.post("/chat", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    # Example: Replace this with your Gemini API call
    gemini_reply = await send_to_gemini(request.message)

    return ChatResponse(reply=gemini_reply)


# ---------- Persist on shutdown ----------
@app.on_event("shutdown")
def _persist():
    save_hospital(hospital)

