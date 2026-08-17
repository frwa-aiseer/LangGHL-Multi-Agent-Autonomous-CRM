# Operant AI — Autonomous CRM & Monetization Operating System

Operant AI is an autonomous AI co-founder and multi-agent CRM orchestration system designed to scale digital courses, high-ticket done-for-you services, and GoHighLevel (GHL) pipeline conversions with zero human operational overhead.

---

## 🧠 Multi-LLM Architecture

Operant AI features an intelligent multi-model routing layer that leverages the distinct strengths of Google Gemini, Anthropic Claude, and OpenAI Codex/GPT:

- **Google Gemini API (`gemini-3.7-flash`, `gemini-2.5-pro`)**:
  - Powers real-time lead qualification, high-speed sentiment analysis, and instant GoHighLevel inbound webhook processing.
- **Anthropic Claude API (`claude-3-7-sonnet`, `claude-3-5-sonnet`)**:
  - Serves as the **Executive AI Co-Founder** & **Objection Handling Closer**, delivering multi-touchpoint hyper-personalized email synthesis and live sales triage consultation.
- **OpenAI Codex / GPT API (`gpt-4o`, `gpt-4o-mini`)**:
  - Handles automated workflow code synthesis, Zapier/Make webhook payload transformations, and GHL custom value logic generation.

---

## ⚡ Key Capabilities

1. **Course & Service Monetization Engine**:
   - Automated curriculum design and offer packaging ($497 Masterclasses, $1,497 Cohorts, $4,997 Done-For-You builds, $12,500/mo Retainers).
   - Real-time Stripe checkout synchronization and instant student enrollment simulator.
2. **AI Sales Consultation & Triage Desk**:
   - Interactive diagnostic calculator matching prospect budget, archetype, and bottlenecks with the optimal offer tier.
   - 24/7 AI Strategic Co-Founder conversational consultation desk.
3. **LangGraph Multi-Agent Canvas**:
   - Visual DAG workflow orchestrating 5 specialized nodes: *Lead Evaluator*, *Objection Handling Closer*, *Calendar Scheduler*, *Student Success Agent*, and *Campaign Publisher*.
4. **GoHighLevel (GHL) Pipeline Kanban & Bi-Directional Sync**:
   - Drag-and-drop opportunity tracking across stages (`New Lead`, `AI Nurturing`, `Demo Booked`, `Won`).
   - Automated opportunity value calculations and real-time contact timeline activity traces.
5. **Multi-Channel Outbound Marketing Studio**:
   - Autonomous generation of LinkedIn thought leadership, Twitter/X breakdown threads, and VSL sales scripts.

---

## 🚀 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/operant-ai-crm.git
cd operant-ai-crm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key_here"

# Anthropic Claude API (Optional / Multi-LLM Routing)
ANTHROPIC_API_KEY="your_anthropic_api_key_here"
CLAUDE_API_KEY="your_claude_api_key_here"

# OpenAI Codex / GPT API (Optional / Multi-LLM Routing)
OPENAI_API_KEY="your_openai_api_key_here"
CODEX_API_KEY="your_codex_api_key_here"

# Application URL
APP_URL="http://localhost:3000"
```

> **Note**: The system is designed with intelligent heuristic fallbacks. If any API key is temporarily absent or throttled, the application will continue to operate seamlessly with simulated intelligence responses.

---

## 🛠️ Running the Application

### Development Mode
Start both the Express backend and Vite frontend with hot reloading:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Production Build
Compile both client and backend bundles:
```bash
npm run build
npm run start
```

---

## 🔌 API Endpoints Reference

| Route | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check & status of all configured LLM providers |
| `/api/providers/status` | `GET` | Multi-LLM provider connection statuses |
| `/api/operant/generate-offer` | `POST` | AI-driven curriculum, syllabus, and offer architect |
| `/api/operant/generate-campaign` | `POST` | Multi-channel social copy & VSL script synthesizer |
| `/api/operant/sales-triage` | `POST` | Prospect qualification & revenue tier matcher |
| `/api/agent/score-lead` | `POST` | AI lead enrichment, scoring (0-100), and strategy recommendations |
| `/api/agent/generate-sequence` | `POST` | Multi-touch personalized cold outreach email generator |
| `/api/agent/handle-reply` | `POST` | Objection handling and calendar booking response engine |
| `/api/ghl/webhook` | `POST` | GoHighLevel webhook ingestion endpoint |

---

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Recharts, Canvas Confetti
- **Backend**: Node.js, Express, TSX, ESBuild
- **AI / LLM Orchestration**: `@google/genai` (Gemini 3.7 / 2.5), Anthropic Claude API, OpenAI Codex / GPT-4o
- **Architecture**: Multi-Agent LangGraph State Machine with GoHighLevel CRM Pipeline Bi-directional Sync

---

## 📄 License
MIT License. Built for autonomous revenue operations and AI-native businesses.
