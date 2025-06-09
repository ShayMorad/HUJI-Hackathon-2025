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
├── HospitalAssistant/       # Backend service (FastAPI)
│   ├── api/app.py          # Route definitions
│   ├── core/               # DB & schemas (Pydantic + SQLite)
│   ├── entities/           # OO models: Patient, Ward, Record...
│   └── data/               # Demo JSON datasets
├── Gemini/                 # Google Gemini NLP client
│   └── gemini.py           # Summaries & NLP hooks
├── docker-compose.yml      # API + ML + infra orchestration
└── README.md
```

| Layer           | Technology & Role                                                    |
| --------------- | -------------------------------------------------------------------- |
| **Backend API** | Python 3.12, FastAPI, Pydantic v2, Uvicorn                           |
| **Logic Layer** | OO Entities for domain rules; `Patient.discharge_ready()` & blockers |
| **Data Layer**  | SQLite (demo) or in‑memory store; JSON seed files                    |
| **NLP/ML**      | XGBoost model + Gemini NLP for text summarization                    |
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
docker compose up --build

# Seed demo data (50 synthetic stays)
python scripts/seed_demo_data.py
```

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
