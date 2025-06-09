# MedAssist AI 🚑🤖

> Revolutionizing hospital discharge decisions with predictive intelligence and actionable insights

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="#tech-stack--architecture"><img src="https://img.shields.io/badge/Backend-FastAPI-green.svg" alt="Built with FastAPI" /></a>
  <a href="#tech-stack--architecture"><img src="https://img.shields.io/badge/Frontend-React-blue.svg" alt="React Frontend" /></a>
  <a href="https://github.com/Noamshabat1/HUJI-Hackathon-2025/actions/workflows/ci.yml/badge.svg"><img src="https://img.shields.io/badge/CI-Status-brightgreen.svg" alt="CI Status" /></a>
</p>

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

<details>
<summary>View screenshots</summary>

| Landing Page                                                         | Doctor Dashboard                                                                  | Login Screen                                                       |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| <img src="docs/images/landing.png" alt="Landing Page" width="300" /> | <img src="docs/images/doctor_dashboard.png" alt="Doctor Dashboard" width="300" /> | <img src="docs/images/login.png" alt="Login Screen" width="300" /> |

</details>

## 🎥 Demo Video

<details>
<summary>Watch a quick demo</summary>

<p align="center">
  <!-- Replace with your actual demo video or GIF -->
  <a href="docs/demo/medassist_demo.gif">
    <img src="docs/demo/medassist_demo.gif" alt="MedAssist AI Demo" width="600" />
  </a>
  <p>Click to view the full demo</p>
</p>

</details>

---

## ⚙️ Tech Stack & Architecture

<details>
<summary>View architecture details</summary>

```plaintext
📦 HUJI-Hackathon-2025
├── .git/                           # Git version history
├── .idea/                          # IDE config files
├── LICENSE                         # Project license (MIT)
├── README.md                       # This documentation
├── docker-compose.yml              # Docker orchestration for API, frontend & services
├── package.json                    # Web frontend dependencies & scripts
├── package-lock.json               # Web frontend lockfile
├── Gemini/                         # Google Gemini NLP client & examples
│   ├── examples.py                 # Usage demos
│   ├── gemini.py                   # API wrapper
│   ├── main.py                     # CLI demo
│   ├── README.md                   # Gemini module docs
│   └── requirements.txt            # Gemini SDK dependencies
├── HospitalAssistant/              # Backend core services (FastAPI + logic)
│   ├── api/                        # FastAPI routes
│   │   ├── app.py                  # Main application and router
│   │   ├── app_full.py             # Extended endpoints (med_assist_api)
│   │   └── __init__.py             # Package init file
│   ├── core/                       # Data layer & schemas
│   │   ├── database.py             # SQLite & in-memory storage setup
│   │   ├── schemas.py              # Pydantic models for requests/responses
│   │   └── __init__.py             # Package init file
│   ├── entities/                   # Domain models (OO logic)
│   │   ├── Hospital.py
│   │   ├── MedicalRecord.py
│   │   ├── Patient.py
│   │   ├── SocialProfile.py
│   │   ├── VitalSign.py
│   │   ├── Ward.py
│   │   └── __init__.py             # Package init file
│   ├── data/                       # Sample hospital datasets (JSON)
│   │   ├── demo_hospital.json
│   │   ├── demo_hospital_data.json
│   │   ├── hospital_15_patients.json
│   │   └── hospital_demo_balanced.json
│   ├── med_assist_website/         # React-based staff dashboard
│   │   ├── package.json            # Frontend dependencies
│   │   ├── public/                 # Static assets & HTML
│   │   ├── src/                    # React source code
│   │   │   ├── components/         # UI components
│   │   │   ├── services/           # API service wrappers
│   │   │   └── ...                 # Other React files
│   │   └── node_modules/           # Frontend modules
│   ├── nurse_online/               # Nurse-focused UI (Vue/React)
│   │   ├── src/                    # Source code
│   │   └── node_modules/           # Dependencies
│   ├── services/                   # Integration & service controllers
│   │   ├── EMRConnector.py         # EMR data extraction logic
│   │   ├── ConversationService.py  # Chat/interaction logic
│   │   ├── LLMService.py           # Gemini/LLM orchestration
│   │   ├── NotificationService.py  # Teams/Slack routing
│   │   └── PredictiveModelController.py # Handles ML inference
│   └── tests/                      # Unit tests
│       └── test_patient.py         # Tests for Patient logic
└── presentation/                   # Pitch deck and assets
    └── MedAssist AI.pptx          # Hackathon slide deck
```

├── .git/                      # Git version history
├── .idea/                     # IDE config files
├── LICENSE                    # Project license (MIT)
├── README.md                  # This documentation
├── docker-compose.yml         # Docker orchestration for API, frontend & services
├── package.json               # Web frontend dependencies & scripts
├── package-lock.json          # Web frontend lockfile
├── Gemini/                    # Google Gemini NLP client & examples
│   ├── examples.py            # Usage demos
│   ├── gemini.py              # API wrapper
│   ├── main.py                # CLI demo
│   ├── README.md              # Gemini module docs
│   └── requirements.txt       # Gemini SDK deps
├── HospitalAssistant/         # Backend core services (FastAPI + logic)
│   ├── api/                   # FastAPI routes
│   │   ├── app.py             # Main application and router
│   │   ├── app\_full.py        # Extended endpoints (med\_assist\_api)
│   │   └── **init**.py        # Package init
│   ├── core/                  # Data layer & schemas
│   │   ├── database.py        # SQLite & in-memory storage setup
│   │   ├── schemas.py         # Pydantic models for requests/responses
│   │   └── **init**.py
│   ├── entities/              # Domain models (OO logic)
│   │   ├── Hospital.py
│   │   ├── MedicalRecord.py
│   │   ├── Patient.py
│   │   ├── SocialProfile.py
│   │   ├── VitalSign.py
│   │   ├── Ward.py
│   │   └── **init**.py
│   ├── data/                  # Sample hospital datasets (JSON)
│   │   ├── demo\_hospital.json
│   │   ├── demo\_hospital\_data.json
│   │   ├── hospital\_15\_patients.json
│   │   └── hospital\_demo\_balanced.json
│   ├── med\_assist\_website/    # React-based staff dashboard
│   │   ├── package.json       # Frontend dependencies
│   │   ├── public/            # Static assets & HTML
│   │   ├── src/               # React source code
│   │   │   ├── components/    # UI components
│   │   │   ├── services/      # API service wrappers
│   │   │   └── ...
│   ├── nurse\_online/          # Nurse-focused UI (Vue/React)
│   │   ├── src/
│   │   └── node\_modules/
│   ├── services/              # Integration & service controllers
│   │   ├── EMRConnector.py    # EMR data extraction logic
│   │   ├── ConversationService.py # Chat/interaction logic
│   │   ├── LLMService.py      # Gemini/LLM orchestration
│   │   ├── NotificationService.py # Teams/Slack routing
│   │   └── PredictiveModelController.py # Handles ML inference
│   └── tests/                 # Unit tests
│       └── test\_patient.py    # Tests for Patient logic
└── presentation/              # Pitch deck and assets
└── MedAssist AI.pptx

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
uvicorn api.app:app --port 8003 --log-level debug

# Launch Frontend Server
cd HospitalAssistant/med_assist_website
npm start
````

⚡️ Open [http://localhost:5173](http://localhost:5173) and log in with `demo / demo123`.

---

## 📡 API Reference

<details>
<summary>Show endpoints</summary>

| Method | Path                | Description                                         |
| ------ | ------------------- | --------------------------------------------------- |
| GET    | `/v1/beds`          | Current bed census & predicted discharge timestamps |
| GET    | `/v1/patients/{id}` | Full patient timeline & blocker list                |
| POST   | `/v1/predict`       | Run discharge-readiness prediction                  |
| GET    | `/v1/health`        | Liveness probe                                      |

Swagger UI available at [http://localhost:8000/docs](http://localhost:8000/docs).

</details>

---

## 👥 Team

| Name           | Role                | Background                             |
| -------------- | ------------------- | -------------------------------------- |
| Nitzan Ventura | ML Lead             | M.Sc. Computer Science (AI)            |
| Noam Shabat    | Full-Stack & DevOps | B.Sc. CS; 4+ years Python & React      |
| Shay Morad     | Product Designer    | UX Specialist, Tel-Aviv Medical Center |
| Samuel Hayard  | Clinical Advisor    | RN; 10 years in inpatient flow mgmt    |

*Built in 24 h at **HUJI Hackathon 2025** (May 29–30, Jerusalem).*

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

> ⚠️ **Disclaimer:** MedAssist AI is a decision-support tool **not approved for direct clinical use**. Always verify recommendations with licensed medical professionals.
