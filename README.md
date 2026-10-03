# CareerForge AI

> **"Prepare for the job you actually want."**

### AI-Powered Technical Interview & Skill Gap Simulator

**CareerForge AI** is a full-stack, Generative AI-powered career readiness platform designed to help job seekers prepare specifically for their target job roles. It analyzes resumes and job descriptions, identifies skill gaps, evaluates job compatibility, conducts adaptive technical mock interviews, and generates personalized learning roadmaps.

**Repository:** `CareerForge-AI-SAP-Mini-Project`

## 1. Key Features

- **Resume Intelligence** – Extracts technical and professional skills from uploaded resumes and distinguishes detected skills from inferred skills with supporting evidence.
- **Job Description Analysis** – Identifies required and preferred competencies, seniority, and domain-specific requirements from target job descriptions.
- **Job Compatibility Analysis** – Generates an explainable compatibility assessment across technical skills, project relevance, experience scope, education baseline, and semantic relevance.
- **Interactive Skill Universe** – Categorizes skills as `STRONG`, `PARTIAL`, or `NOT DEMONSTRATED` and provides supporting evidence.
- **Adaptive AI Mock Interviews** – Generates role-specific technical questions and adapts interview difficulty based on candidate responses.
- **AI Answer Evaluation** – Evaluates responses using Technical Accuracy, Problem Solving, Completeness, Role Relevance, and Communication.
- **Personalized Career Roadmaps** – Generates learning recommendations based on identified skill gaps.
- **Progress Tracking** – Allows users to repeat interviews and compare their performance over time.
- **Voice Interaction** – Supports speech input and audio playback using web speech capabilities and AI-powered text-to-speech.

## 2. Technology Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide Icons
- Canvas Confetti
- Web Speech API

### Backend
- Node.js
- Express
- TypeScript
- TSX
- Bcrypt
- JSON Web Tokens (JWT)
- HTTP-only secure cookies
- Multer
- PDF-Parse

### Database & Persistence
- Structured relational-style data persistence
- Firebase Firestore configuration
- Foreign-key relationships and constraints
- Atomic write transactions

### Generative AI
- `@google/genai` TypeScript SDK
- Gemini-based text and evaluation models
- Gemini-based text-to-speech
- Structured JSON schemas
- Prompt-injection protection using input delimiters

## 3. System Workflow

```text
Candidate Resume
       │
       ▼
Resume Processing
       │
       ▼
Skill & Evidence Extraction
       │
       ├──────────────┐
       │              │
       ▼              ▼
Target Job       Candidate Profile
Description           │
       │              │
       └──────┬───────┘
              ▼
      Compatibility Analysis
              │
              ▼
        Skill Gap Analysis
              │
              ▼
      Adaptive Mock Interview
              │
              ▼
       Answer Evaluation
              │
              ▼
      Personalized Roadmap
              │
              ▼
        Progress Tracking
              │
              ▼
         Test Me Again
```

## 4. AI Evaluation

CareerForge AI uses a structured evaluation framework for technical interview responses:

| Evaluation Area | Weight |
|---|---:|
| Technical Accuracy | 30% |
| Problem Solving | 25% |
| Completeness | 20% |
| Role Relevance | 15% |
| Communication | 10% |

The final evaluation is calculated programmatically using predefined criteria rather than allowing the AI model to arbitrarily assign the overall score.

## 5. Security

CareerForge AI includes several security mechanisms:

- Server-side ownership verification to prevent unauthorized access to user resources.
- IDOR protection for resumes, jobs, matches, and interview sessions.
- Bcrypt password hashing.
- JWT authentication using secure HTTP-only cookies.
- Sanitized uploaded filenames.
- Randomized identifiers for uploaded documents.
- Prompt-injection protection for untrusted resumes, job descriptions, and answers.
- Strict separation between system instructions and user-provided content.

## 6. Project Structure

```text
CareerForge-AI-SAP-Mini-Project/
│
├── client/
│   └── Frontend application
│
├── server/
│   └── Backend and API logic
│
├── data/
│   └── Application persistence data
│
├── firebase-applet-config.json
├── firestore.rules
├── package.json
└── README.md
```

> The exact folder structure may vary depending on the current project implementation.

## 7. Demo Account

A pre-seeded demonstration account is available for testing the application.

```text
Email: candidate@careerforge.ai
Password: Candidate@2026!
```

The demonstration account contains sample candidate information, a target job, and a completed mock interview session.

## 8. Local Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## 9. Project Objective

The objective of CareerForge AI is to provide a personalized, AI-powered career preparation experience that connects a candidate's actual skills with the requirements of a specific target role.

Instead of relying on generic interview preparation, the platform creates a continuous workflow:

**Resume → Target Job → Skill Gap → Adaptive Interview → AI Evaluation → Learning Roadmap → Re-Interview**

## 10. SAP Mini Project

CareerForge AI was developed as a **Mini Project under the SAP Educate to Employ (E2E) Programme**, demonstrating the practical application of Generative AI, full-stack development, and intelligent career-readiness technologies.

## 11. Future Scope

- Multimodal interview support using audio and video.
- Additional Generative AI model integrations.
- Improved skill and evidence extraction.
- Advanced interview analytics.
- Multi-language interview support.
- Integration with additional job platforms.
- Expanded learning-resource recommendations.
- Large-scale cloud deployment and optimization.

## 12. License

This project was developed for educational and project-development purposes as part of the SAP Educate to Employ (E2E) Programme.
