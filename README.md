# CareerForge AI
> **"Prepare for the job you actually want."**  
> AI-Powered Technical Interview & Skill Gap Simulator

CareerForge AI is a production-grade full-stack career readiness platform. It bridges the gap between static resume screening and real technical interviews by performing verifiable evidence extraction, hybrid skill-gap mapping, personalized adaptive mock interviews, and automated learning roadmaps.

---

## 1. Problem Statement & Objectives
- **The Problem:** Job seekers submit generic resumes and undergo disjointed interview prep with canned, static questionnaires that bear zero relationship to their actual resume projects or specific target job requirements.
- **The Solution:** CareerForge AI establishes a closed-loop intelligence pipeline:
  1. **Real Resume Ingestion:** Extracts verified engineering capabilities, clearly distinguishing explicit *detected* skills from contextual *inferred* skills with exact citations.
  2. **Job Description Intelligence:** Parses target job requirements into *must-have* (critical) and *nice-to-have* (preferred) competencies, seniority, and domain context.
  3. **Explainable Compatibility Engine:** Computes an explainable Job Compatibility Score across 5 weighted dimensions (Technical Skill Match, Project Relevance, Experience Scope, Education Baseline, and Semantic Synergy).
  4. **Interactive Skill Universe:** Displays categorized skills (`STRONG`, `PARTIAL`, `NOT DEMONSTRATED`) with click-to-inspect evidence drawers.
  5. **Adaptive AI Mock Interview Room:** Probes identified gaps adaptively—increasing architectural depth on strong answers, and testing foundational intuition when candidates struggle.
  6. **Deterministic Answer Evaluation:** Programs transparent weighted scores across Technical Accuracy (30%), Problem Solving (25%), Completeness (20%), Role Relevance (15%), and Communication (10%).
  7. **Personalized Roadmaps & Re-Interview:** Tracks score deltas and skill improvements over time through "Test Me Again" re-interviews.

---

## 2. Technology Stack
- **Frontend:**
  - React 19, TypeScript
  - Tailwind CSS v4
  - Lucide Icons
  - Canvas Confetti
  - Web Speech API (Microphone Speech-to-Text & Audio playback)
- **Backend:**
  - Node.js, Express, TypeScript (`tsx`)
  - Bcrypt password hashing (Cost factor 10)
  - JSON Web Tokens (JWT) with secure HTTP-only cookies
  - Multer memory storage & PDF-Parse for direct document parsing
- **Database & Persistence:**
  - Relational schema engine with foreign keys, constraints, and atomic write transactions (`data/careerforge.db.json`)
  - Firebase Firestore configured (`firebase-applet-config.json`, `firestore.rules`)
- **AI / LLM Engine:**
  - `@google/genai` TypeScript SDK
  - Text & Schema Evaluation: `gemini-3.8-flash`
  - Text-to-Speech (TTS): `gemini-3.8-flash-lite-tts`
  - Strict JSON schemas & Prompt Injection Delimiters

---

## 3. Core Architecture & Security Architecture
- **In-Depth IDOR Defense:** Every resume, job, match, and interview session has strict server-side owner verification. Cross-user access via parameter tampering is strictly blocked.
- **Input Sanitization & Safe Filenames:** Uploaded documents receive randomized UUID-backed file identifiers (`res_<timestamp>_<hex>`). Original filenames are sanitized to prevent directory traversal attacks.
- **Prompt Injection Delimiters:** Untrusted user resumes, job descriptions, and answers are encapsulated inside `<untrusted_*>` boundary blocks with un-overrideable system instructions.
- **Deterministic Programmatic Scoring:** The LLM does not arbitrarily assign overall scores. Scoring is calculated programmatically using strict rubrics.

---

## 4. API Endpoints
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account with hashed password | No |
| `POST` | `/api/auth/login` | Log in and receive secure session cookie | No |
| `POST` | `/api/auth/logout` | Invalidate session | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `POST` | `/api/resumes/upload` | Upload PDF or text resume with AI extraction | Yes |
| `GET` | `/api/resumes` | List user resumes | Yes |
| `DELETE` | `/api/resumes/:id` | Delete resume with IDOR check | Yes |
| `POST` | `/api/jobs` | Analyze job description with AI | Yes |
| `GET` | `/api/jobs` | List user target jobs | Yes |
| `POST` | `/api/analysis/match` | Compute compatibility and skill gaps | Yes |
| `POST` | `/api/interviews` | Create adaptive interview session | Yes |
| `POST` | `/api/interviews/:id/answers` | Submit answer for AI evaluation | Yes |
| `POST` | `/api/interviews/:id/skip` | Skip current question | Yes |
| `GET` | `/api/interviews/:id/report` | Fetch final coaching report | Yes |
| `GET` | `/api/interviews/:id/tts` | Real question speech audio (WAV) | Yes |
| `GET` | `/api/roadmaps/:jobId` | Fetch personalized career roadmap | Yes |
| `GET` | `/api/progress` | Progression metrics & history | Yes |
| `POST` | `/api/code/run` | Sandboxed JavaScript runner | Yes |
| `GET` | `/api/admin/stats` | Telemetry & system health | Admin only |
| `GET` | `/api/test-security` | Run automated security assertions | No |

---

## 5. Pre-Seeded Demonstration Accounts
For immediate testing without manual document entry:
- **Candidate User:**
  - Email: `candidate@careerforge.ai`
  - Password: `Candidate@2026!`
  - Pre-populated with Alex Rivera's Full-Stack resume, a Stripe Senior Platform Engineer target job, and a completed mock interview session.
- **Admin User:**
  - Email: `admin@careerforge.ai`
  - Password: `Admin@Forge2026!`
  - Access to the Admin Operations Center and audit streams.

---

## 6. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
