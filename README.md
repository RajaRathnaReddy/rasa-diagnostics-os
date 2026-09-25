# 🏥 RASA DIAGNOSTICS OS

> **"One Intelligent Operating System for Modern Diagnostic Centers"**

A production-grade, enterprise-level multi-speciality Diagnostic Center Management Platform designed for high-throughput diagnostic networks, hospital lab departments, and standalone imaging centers.

---

## 🌟 Key Modules & Capabilities

- **🔬 Laboratory Information System (LIS)**: Complete sample accessioning, barcoding, analyzer interfacing, delta-checking, and automated critical value alerts.
- **🩻 Radiology Information System (RIS) & Web PACS**: Built-in interactive DICOM viewer with windowing presets (Bone, Soft Tissue, Lung, Brain), pan/zoom/invert tools, distance caliper, and AI CADx anomaly detection heatmaps.
- **📋 Walk-In Reception & Fasting Countdown**: Live token display with status tracking, fasting duration countdown timers, and audio chime simulation.
- **🩺 Doctor Consultations & Safety Screening**: Appointment management with pre-scan eGFR / creatinine renal safety checklists and allergy flags.
- **👤 Master Admin Security Console**:
  - Full RBAC with granular module permissions.
  - User creation, passcodes, branch assignments.
  - Instant account blocking/suspension.
  - Safe user deletion with Master Admin protection.
  - Self-service password reset & passkeys via Firebase Auth.
- **⚡ Quick Actions (Speed-Dial)**: Register patients, book scans, log specimens, generate bills, or refer doctors in a single unified modal.
- **🤖 Diagnostic AI Copilot**: Context-aware clinical assistant for reference ranges, differential diagnoses, and protocol recommendations.
- **☁️ Real-time Cloud Sync**: Powered by Google Cloud Firestore for bi-directional live state updates.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Icons**: Lucide React
- **Charts & Metrics**: Recharts
- **Forms & Validation**: React Hook Form + Zod
- **Cloud Backend**: Google Firebase (Firestore + Authentication)
- **Deployment**: Vercel

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/RajaRathnaReddy/rasa-diagnostics-os.git
cd rasa-diagnostics-os
npm install
```

### 2. Environment Setup
Create a `.env` file (or use default built-in Firebase settings):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=rasa-diagnstic-os.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rasa-diagnstic-os
VITE_FIREBASE_STORAGE_BUCKET=rasa-diagnstic-os.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=977266563144
VITE_FIREBASE_APP_ID=1:977266563144:web:7945d3db620fdea783a07d
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Master Admin Credentials

- **Administrator**: Raja Rathna Reddy
- **Email**: `a.rajarathnareddychenni@gmail.com`
- **Security Passcode**: `admin123`

---

## 📄 License
Proprietary & Confidential — **Rasa Diagnostics OS** © 2026. All rights reserved.
