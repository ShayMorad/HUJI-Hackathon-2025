"""
FastAPI Application Entry Point

Exposes:
  - GET  /patients/{patient_id}
  - POST /chat
  - POST /predict/{patient_id}
  - GET  /wards/{ward_id}
  - GET  /hospital/report
  - GET  /hospital/bottlenecks
"""

from typing import List, Dict, Any
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

app = FastAPI(title="Hospital AI Agent API")

# Instantiate shared services & hospital container
emr_connector = EMRConnector("http://localhost:8080/fhir", api_key="YOUR_KEY")
llm_service = LLMService("http://localhost:8000/api", api_key="YOUR_KEY")
conversation_service = ConversationService(llm_service)
predictive_controller = PredictiveModelController()
notification_service = NotificationService()
hospital = Hospital("hosp-001", "General Hospital", wards=[])


# Pydantic response models
class VitalSignResponse(BaseModel):
    timestamp: str
    type: str
    value: float


class PatientResponse(BaseModel):
    patient_id: str
    name: str
    age: int
    ward_id: str
    preferred_language: str
    social: Dict[str, Any]
    vitals: List[VitalSignResponse]


class ChatRequest(BaseModel):
    patient_id: str
    message: str


class ChatResponse(BaseModel):
    response: str


class PredictionResponse(BaseModel):
    type: str
    value: str
    description: str


class WardResponse(BaseModel):
    ward_id: str
    name: str
    capacity: int
    occupancy: int
    free_beds: int


class HospitalReport(BaseModel):
    hospital_id: str
    name: str
    total_capacity: int
    total_occupied: int
    total_free_beds: int
    bottlenecks: List[Dict[str, Any]]


#TODO Get patient discharge prediction
#TODO Get patient summary
##TODO Get whole database

# Endpoints (stubs)
@app.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str):
    raise HTTPException(status_code=501, detail="Not implemented")


@app.post("/chat", response_model=ChatResponse)
def chat_with_patient(req: ChatRequest):
    raise HTTPException(status_code=501, detail="Not implemented")


@app.post("/predict/{patient_id}", response_model=PredictionResponse)
def predict_discharge(patient_id: str):
    raise HTTPException(status_code=501, detail="Not implemented")


@app.get("/wards/{ward_id}", response_model=WardResponse)
def get_ward(ward_id: str):
    raise HTTPException(status_code=501, detail="Not implemented")


@app.get("/hospital/report", response_model=HospitalReport)
def get_hospital_report():
    raise HTTPException(status_code=501, detail="Not implemented")


@app.get("/hospital/bottlenecks", response_model=List[Dict[str, Any]])
def get_hospital_bottlenecks(threshold: float = 0.8):
    raise HTTPException(status_code=501, detail="Not implemented")
