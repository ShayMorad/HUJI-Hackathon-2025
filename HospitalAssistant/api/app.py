from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from services.EMRConnector import EMRConnector
from services.LLMService import LLMService
from services.ConversationService import ConversationService
from services.PredictiveModelController import PredictiveModelController
from services.NotificationService import NotificationService
from entities.SocialProfile import SocialProfile
from entities.Patient import Patient
from entities.Ward import Ward
from entities.Hospital import Hospital

app = FastAPI(title="MedAssist AI Backend")

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


# ---------- Persist on shutdown ----------
@app.on_event("shutdown")
def _persist():
    save_hospital(hospital)
