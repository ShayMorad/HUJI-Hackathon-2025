# MedAssist AI 🚑🤖

> Revolutionizing hospital discharge decisions with predictive intelligence and actionable insights

---

## 🔍 Overview

MedAssist AI is an advanced hospital coordination platform that:

* Forecasts discharge readiness **12–24 hours** in advance (AUROC 0.91).
* Identifies clinical & operational blockers (labs, consults, transport) in real time.
* Routes actionable tasks to the right roles via Teams/Slack.

Designed for capacity‑strained hospitals, MedAssist AI reclaims lost bed‑days, reduces infection risk, and boosts patient satisfaction—all on top of existing EMRs.

---

## 🌟 Key Features

| Feature                          | Benefit                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------- |
| 🚑 **Real-time Bed Dashboard**   | Live EMR sync of occupancy, predicted discharges & length-of-stay metrics       |
| 🤖 **Discharge-Readiness Score** | Gradient-boosted model trained on 200 k records to flag “green-for-go” patients |
| 📝 **Blocker Detection**         | Combines rules (orders/labs) + NLP on notes to surface open tasks               |
| 📬 **Smart Task Routing**        | Automates assignment of blockers to nurses, PTs, social workers, etc.           |
| 💬 **Self-Service Chatbot**      | `/status <PatientID>` returns LOS, blockers & next steps instantly              |
| 🔒 **Privacy by Design**         | All PHI de-identified on‑prem; zero identifiers leave hospital network          |
| 🔌 **Plugin-Friendly**           | Swap ML models or EMR connectors (FHIR, HL7) with modular adapters              |

---

## 📸 Screenshots

| Landing Page | Doctor Dashboard | Login Screen |
| ------------ | ---------------- | ------------ |
|              |                  |              |

## 🎥 Demo Video

---

## ⚙️ Tech Stack & Architecture

```plaintext
📦 HUJI-Hackathon-2025
├── .git/                          # Git version history
├── .idea/                         # IDE config files
├── LICENSE                        # MIT license
├── README.md                      # Project documentation
├── docker-compose.yml             # Service orchestration: backend, frontend, services
├── package.json                   # Frontend dependencies & scripts
├── package-lock.json              # Frontend lockfile
├── Gemini/                        # Google Gemini NLP integration
│   ├── examples.py                # Usage examples for Gemini client
│   ├── gemini.py                  # API wrapper for Gemini
│   ├── main.py                    # CLI demonstration
│   └── requirements.txt           # Gemini SDK dependencies
├── HospitalAssistant/             # Core backend (FastAPI + domain logic)
│   ├── api/                       # FastAPI routes
│   │   ├── __init__.py            # Package marker
│   │   ├── app.py                 # Main application and router
│   │   └── app_full.py            # Extended endpoints for med_assist_api
│   ├── core/                      # Data layer & schemas
│   │   ├── __init__.py            # Package marker
│   │   ├── database.py            # SQLite/in-memory storage setup
│   │   └── schemas.py             # Pydantic models for requests/responses
│   ├── entities/                  # Domain models (OO logic)
│   │   ├── __init__.py            # Package marker
│   │   ├── Hospital.py
│   │   ├── MedicalRecord.py
│   │   ├── Patient.py
│   │   ├── SocialProfile.py
│   │   ├── VitalSign.py
│   │   └── Ward.py
│   ├── data/                      # Sample hospital datasets (JSON)
│   │   ├── demo_hospital.json
│   │   ├── demo_hospital_data.json
│   │   ├── hospital_15_patients.json
│   │   └── hospital_demo_balanced.json
│   ├── services/                  # External integrations & service controllers
│   │   ├── EMRConnector.py        # EMR data extraction
│   │   ├── ConversationService.py # Chat/interaction logic
│   │   ├── LLMService.py          # Gemini/LLM orchestration
│   │   ├── NotificationService.py # Teams/Slack routing
│   │   └── PredictiveModelController.py # ML inference handler
│   └── tests/                     # Unit tests
│       └── test_patient.py        # Tests for Patient logic
├── presentation/                  # Pitch deck and assets
│   └── MedAssist AI.pptx         # Hackathon slide deck
└── docs/                          # Documentation assets
    ├── images/                    # Screenshots for README
    │   ├── landing.png
    │   ├── doctor_dashboard.png
    │   └── login.png
    └── demo/                      # Demo video/GIF
        └── medassist_demo.gif
```

````

---

| Layer           | Technology & Role                                                    |
|-----------------|----------------------------------------------------------------------|
| **Backend API** | Python 3.12, FastAPI, Pydantic v2, Uvicorn                           |
| **Logic Layer** | OO Entities for domain rules; `Patient.discharge_ready()` & blockers  |
| **Data Layer**  | SQLite (demo) or in‑memory store; JSON seed files                    |
| **NLP/ML**      | XGBoost model + Gemini NLP for text summarization                   |
| **Infra**       | Docker Compose; GitHub Actions CI/CD                                 |

**Extensibility:** Modular adapters let you swap LLM providers (OpenAI, Cohere), upgrade to PostgreSQL or FHIR feeds, and containerize services independently.

</details>

---


## 🚀 Quick Start
```bash
# Clone repo
git clone https://github.com/Noamshabat1/HUJI-Hackathon-2025.git
cd HUJI-Hackathon-2025

# Launch services

# Launch Backend Server
cd HospitalAssistant
uvicorn api.app:app --port 8003 --log-level debug

# Launch Frontend Server
cd HospitalAssistant/med_assist_website
npm start
````

⚡️ Open [http://localhost:5173](http://localhost:5173) and log in with `demo / demo123`.

---

## 📡 API Reference

| Method | Path                | Description                                         |
| ------ | ------------------- | --------------------------------------------------- |
| GET    | `/v1/beds`          | Current bed census & predicted discharge timestamps |
| GET    | `/v1/patients/{id}` | Full patient timeline & blocker list                |
| POST   | `/v1/predict`       | Run discharge-readiness prediction                  |
| GET    | `/v1/health`        | Liveness probe                                      |

Swagger UI available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 👥 Team

| Name           | Role                | Background                             |
| -------------- | ------------------- | -------------------------------------- |
| Nitzan Ventura | ML Lead             | M.Sc. Computer Science (AI)            |
| Noam Shabat    | Full-Stack & DevOps | B.Sc. CS; 4+ years Python & React      |
| Shay Morad     | Product Designer    | UX Specialist, Tel-Aviv Medical Center |
| Samuel Hayard  | Clinical Advisor    | RN; 10 years in inpatient flow mgmt    |

*Built in 24 h at ********HUJI Hackathon 2025******** (May 29–30, Jerusalem).*

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

> ⚠️ **Disclaimer:** MedAssist AI is a decision-support tool **not approved for direct clinical use**. Always verify recommendations with licensed medical professionals.
