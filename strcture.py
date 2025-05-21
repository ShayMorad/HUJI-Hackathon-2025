"""
HospitalAssistant/
├─ entities/
│   ├─ __init__.py
│   ├─ VitalSign.py
│   ├─ MedicalRecord.py
│   ├─ SocialProfile.py
│   ├─ Patient.py
│   └─ Ward.py
├─ services/
│   ├─ __init__.py
│   ├─ EMRConnector.py
│   ├─ LLMService.py
│   ├─ ConversationService.py
│   ├─ PredictiveModelController.py
│   └─ NotificationService.py
├─ api/
│   ├─ __init__.py
│   └─ app.py
└─ frontend/
   ├─ package.json
   ├─ tsconfig.json
   └─ src/
      ├─ queues/
      │  ├─ NotificationQueue.ts
      │  └─ ChatQueue.ts
      ├─ context/
      │  └─ QueueContext.tsx
      └─ components/
         ├─ NurseDashboard.tsx
         ├─ DoctorDashboard.tsx
         ├─ AdminDashboard.tsx
         ├─ ChatInterface.tsx
         └─ NotificationCenter.tsx
"""