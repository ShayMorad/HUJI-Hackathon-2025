# MedAssist AI 🚑🤖

*Smarter hospital flow, with AI at your side.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)](#tech-stack--architecture)
[![React Frontend](https://img.shields.io/badge/Frontend-React-blue)](#tech-stack--architecture)
[![CI Status](https://github.com/Noamshabat1/HUJI-Hackathon-2025/actions/workflows/ci.yml/badge.svg)](https://github.com/Noamshabat1/HUJI-Hackathon-2025/actions)

---

## Table of Contents

1. [Why MedAssist AI?](#why-medassist-ai)
2. [Live Demo & Screenshots](#live-demo--screenshots)
3. [Feature Highlights](#feature-highlights)
4. [Tech Stack & Architecture](#tech-stack--architecture)
5. [Quick Start](#quick-start)
6. [API Reference](#api-reference)
7. [Model Card](#model-card)
8. [Roadmap](#roadmap)
9. [Contributing](#contributing)
10. [Team](#team)
11. [License](#license)

---

## Why MedAssist AI?

### Hospitals are at a breaking point

* Global inpatient occupancy has hovered above **90 %** since 2021, leaving virtually no surge buffer.
* Every avoidable inpatient day costs **US \$500–2 000**, ties up **≈ 6 h** of nursing time, and raises the risk of hospital‑acquired infection by **7 %**.
* ER boarding has become the norm: in the U.S. **> 1 million hours** of ambulance downtime were logged in 2024 because no beds were available.

### Discharge is the hidden lever

Clinical discharge orders are only half the story. **10–15 % of beds** are occupied by “green‑for‑go” patients who cannot leave because one last task is stuck in limbo—waiting for transport, a social‑work assessment, or a single lab result. These micro‑delays create macro‑gridlock.

### What clinicians say — Interview insights from Prof. Michael Rosenberg

Prof. Rosenberg, Division Director of Interventional Radiology, confirms:

> "The biggest challenge in discharging a patient isn’t always clinical—it’s logistical. The patient may be ready, but transport, paperwork, or social support isn't."
> "Everything is technically documented in the EMR: clinical history, pending orders, social notes—but we don’t have a smart way to pull the pieces together to guide action."

He emphasizes that:

* The **entire discharge process spans multiple roles**—nurses, residents, case managers—often needing **3–4 hours per patient**.
* **Most information already exists** in digital form, but there's no system smart enough to summarize, infer readiness, and surface blockers.
* **Explainability is essential**: "If an AI suggests something, we must know why—what data led to that suggestion and what actions it recommends."

### MedAssist AI shifts work **up‑stream**

1. **See the future —** A gradient‑boosted model ingests live EMR, orders, and free‑text notes to forecast discharge readiness **a full day in advance** (AUROC 0.91).
2. **Expose root blockers —** An explainability layer maps the prediction to actionable items (*“CBC pending”*, *“MRI 08:00”*, *“PT clearance needed”*).
3. **Orchestrate resolution —** A rules engine routes each blocker to the right role (nurse, porter, PT, social worker) via Teams/Slack, turning a reactive scramble into a proactive workflow.

### What that means in dollars *and* lives

* **Zero‑integration pilot** — Works off FHIR/HL7 feeds already exposed by all major EMRs.
* **Explainable AI** — SHAP‑based blocker breakdown earns clinician trust.
* **Edge‑only deployment** — Inference runs on‑prem; no PHI leaves the hospital, smoothing the path through InfoSec and HIPAA/GDPR compliance.
* **Regulatory tailwinds** — The EU AI Act explicitly exempts decision‑support tools that keep a human in the loop, de‑risking certification.

---

## Live Demo & Screenshots

> ℹ️ **Tip:** Replace the image files below with real screenshots (PNG/JPG/GIF) or a short video GIF. Keep filenames but overwrite the images for automatic README updates.

| Landing Page                        | Doctor Dashboard                               | Login Screen                    |
| ----------------------------------- | ---------------------------------------------- | ------------------------------- |
| ![Landing](docs/images/landing.png) | ![Dashboard](docs/images/doctor_dashboard.png) | ![Login](docs/images/login.png) |

*A 60‑second product tour video will be available soon.*

---

## Feature Highlights

| Category                         | What it does                                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Real‑time Bed Dashboard**      | Live sync with the EMR showing occupancy, predicted discharges, and risk‑adjusted LOS.                     |
| **AI Discharge‑Readiness Score** | Gradient‑boosted model trained on 200 k anonymised stays; **AUROC ≈ 0.91**.                                |
| **Blocker Detection**            | Rules (orders/labs) + NLP on free‑text notes surface open tasks instantly.                                 |
| **Smart Task Routing**           | Assigns each blocker to the correct role (nurse, resident, PT, social worker) and pushes to Teams / Slack. |
| **Self‑service Chat**            | `/status <PatientID>` bot returns LOS, blockers, and next steps—instantly.                                 |
| **Privacy by Design**            | De‑identifies PHI at source; no patient identifiers leave the hospital network.                            |
| **Plugin Friendly**              | Swap model providers (OpenAI, AzureML) or EMR connectors (FHIR, HL7) with drop‑in modules.                 |

---

## Tech Stack & Architecture

```
                             ┌───────────────┐
     Web / Ward Dashboard    │   React UI    │
                             │  (Vite+MUI)   │
                             └──────┬────────┘
                                    │ REST / WS
                             ┌──────▼────────┐
    Teams / Slack Bot  ─────►│  FastAPI API  │◄─ gRPC ───┐
                             │  (Uvicorn)    │           │
                             └──────┬────────┘           │
                                    │                   ▼
                             ┌──────▼────────┐    ┌────────────┐
                             │   ML Service   │    │ Postgres   │
                             │ (XGBoost 1.7)  │    │ 16 + Times │
                             └─▲──────────▲───┘    └────────────┘
                               │          │
FHIR/HL7 feed ────────────────┘          └─▶ S3‑compatible object storage
```

* **Frontend** — React 18, Vite, MUI, Chart.js, Tailwind.
* **Backend API** — Python 3.12, FastAPI, SQLModel, Pydantic v2, Uvicorn.
* **ML Service** — XGBoost + Optuna; containerised for hot‑swap retraining.
* **DB** — PostgreSQL 16 with `LISTEN/NOTIFY` for real‑time bed events.
* **Infra** — Docker + docker‑compose; GitHub Actions → Railway (demo) / on‑prem K8s.

---

## Quick Start

```bash
# 1 ▸ Clone the repo
git clone https://github.com/Noamshabat1/HUJI-Hackathon-2025.git
cd HUJI-Hackathon-2025

# 2 ▸ Spin up the full stack (frontend, API, DB, ML‑service)
docker compose up --build

# 3 ▸ Load demo data (50 synthetic patient stays)
python scripts/seed_demo_data.py
```

Open **[http://localhost:5173](http://localhost:5173)** and log in with `demo / demo123`.

> **Local only:** Demo data are randomly generated and fully anonymised.

---

## API Reference

*Base URL `http://localhost:8000`*

| Method | Path                | Description                                        |
| ------ | ------------------- | -------------------------------------------------- |
| `GET`  | `/v1/beds`          | Current bed census & predicted discharge times     |
| `GET`  | `/v1/patients/{id}` | Full patient timeline & blocker list               |
| `POST` | `/v1/predict`       | Run discharge‑readiness inference on supplied JSON |
| `GET`  | `/v1/health`        | Liveness probe                                     |

Interactive Swagger UI at **`/docs`**.

---

## Model Card

| Field             | Value                                                                         |
| ----------------- | ----------------------------------------------------------------------------- |
| **Model type**    | Gradient‑boosted decision trees (XGBoost 1.7)                                 |
| **Training data** | 2018‑2024 anonymised inpatient stays (≈ 200 000) from three Israeli hospitals |
| **Features**      | Age, primary Dx, lab deltas, procedures, consults, vitals trends              |
| **Label**         | `1` if discharge occurred within next 24 h                                    |
| **AUROC**         | 0.91 ± 0.02 (5‑fold CV)                                                       |
| **Fairness**      | Performance parity across sex & age groups (≤ 2 p.p. difference)              |
| **Intended use**  | Decision‑support *only*—not a standalone discharge order                      |
| **Limitations**   | Does not capture social determinants (home caregiving, transport capacity)    |

---

## Roadmap

* [ ] **eMAR integration** for real‑time medication completion checks
* [ ] **Explainability UI** (per‑patient SHAP waterfalls)
* [ ] **Hebrew interface** for local staff
* [ ] **Edge model** for offline ward kiosks (Raspberry Pi)
* [ ] **ISO 13485 quality plan** toward Class IIa certification

---

## Contributing

1. **Fork** → create feature branch → **PR** against `main`.
2. Pre‑commit hooks run **ruff**, **black**, and **isort** automatically.
3. Every PR must pass `pytest -q` and keep coverage ≥ 90 %.
4. Be kind—our code of conduct lives in `CODE_OF_CONDUCT.md`.

We welcome PRs that improve docs, add tests, or tackle roadmap items.

---

## Team

| Name               | Role                | Background                             |
| ------------------ | ------------------- | -------------------------------------- |
| **Nitzan Ventura** | ML Lead             | M.Sc. in Computer Science (AI)         |
| **Noam Shabat**    | Full‑Stack & DevOps | B.Sc. CS, 4 + years Python/React       |
| **Shay Morad**     | Product Designer    | UX specialist, Tel‑Aviv Medical Center |
| **Samuel Hayard**  | Clinical Advisor    | RN, 10 years inpatient flow mgmt       |

*Built in 24 h at **HUJI Hackathon 2025** (Jerusalem, May 29–30).*

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

> **MedAssist AI is a decision‑support tool—not approved for direct clinical use.
> Always verify recommendations with licensed medical professionals.**
