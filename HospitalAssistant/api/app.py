from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
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
    VitalSignSchema, ChatResponse, ChatRequest, PromptOnly,
)
from entities.VitalSign import VitalSign
from services.LLMService import LLMService  # Adjust path as needed

llm_service = LLMService()  # You can pass a model_name if needed
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

@app.post("/chat_plain")
async def chat_plain(request: Request):
    try:
        prompt = await request.body()
        prompt = prompt.decode("utf-8").strip()

        # Optionally log or validate prompt
        if not prompt:
            raise ValueError("Empty prompt received")

        # Call your Gemini LLM
        response_text = llm_service.chat(context={}, prompt=prompt, language="hebrew")
        return JSONResponse(content={"reply": response_text})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/chat_simple", response_model=ChatResponse)
async def chat_simple(payload: PromptOnly):
    try:
        gemini_reply = llm_service.chat({}, prompt=payload.message, language="hebrew")
        return ChatResponse(reply=gemini_reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    try:
        patient = hospital.find_patient(request.patientId)
        context = {
            "patient_history": f"{patient.name}, age {patient.age}",
            "current_condition": patient.status,
            "vital_signs": str(patient.vitals)
        }

        # Call Gemini
        gemini_reply = llm_service.chat(context, prompt=request.message, language="hebrew")

        return ChatResponse(reply=gemini_reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ---------- Persist on shutdown ----------
@app.on_event("shutdown")
def _persist():
    save_hospital(hospital)

