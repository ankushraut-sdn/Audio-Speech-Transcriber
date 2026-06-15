# 📊 Audio-Speech-Transcriber (NLP)

This is a premium, high-value full-stack decoupled Proof-of-Concept (POC) project that forms a key pillar of the **AI/ML Developer Master Portfolio Matrix**.

---

## 🔬 Core Concept & Algorithm Framework
Converts audio waveforms into highly accurate text transcriptions with timestamps using OpenAI's Whisper model.

---

## 🗂️ Decoupled Architecture & Directory Tree
The project features a clean, professional separation of concerns between frontend client layers and backend microservices.

```text
Audio-Speech-Transcriber/
├── frontend/               # React 18 + Vite Glassmorphic Client Workspace
│   ├── src/
│   │   ├── App.jsx         # Console Dashboard Interfaces
│   │   └── index.css       # Custom Glassmorphism Theme Styling
│   ├── vite.config.js      # Decoupled Vite Proxy Server Config
│   └── package.json        # Frontend Node Dependencies
│
├── backend/                # Modular FastAPI Microservices Package
│   ├── app/
│   │   ├── core/           # Configuration management
│   │   ├── api/v1/         # Endpoints & Router controllers
│   │   └── services/       # Dynamic algorithm calculation models
│   │
│   ├── code/               # Native Cloud/Engine Inference Entrypoints
│   ├── model/              # Serialized Model Weights & Mappings
│   ├── metadata/           # Model Governance Audit Parameters
│   ├── mcp_server.py       # Stdio JSON-RPC 2.0 Agentic MCP Interface
│   ├── app.py              # Backend entrypoint runner
│   └── requirements.txt    # Backend Python dependencies
│
├── Dockerfile              # Multi-Stage Build Configurations
├── .dockerignore           # Container Exclusions Profile
└── .gitignore              # Local Version Exclusions
```

---

## 🤖 Native Agentic Integration (MCP Tool)
This project features a native, zero-dependency **Model Context Protocol (MCP)** stdio server that allows AI agents to interact with the project programmatically:

* **MCP Tool Name**: `transcribe_audio_speech`
* **Description**: Convert input vocal audio data into text sequences with millisecond token timestamps.
* **Interface Protocol**: Stdio JSON-RPC 2.0 standard.

---

## 🚀 Execution & Deployment Instructions

### Method A: Local execution
1. Run uvicorn:
   ```bash
   cd backend && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Method B: Containerized Execution (Docker)
1. **Build the multi-stage image** from the project's root:
   ```bash
   docker build -t audio-speech-transcriber .
   ```
2. **Run the container**:
   ```bash
   docker run -p 8000:8000 audio-speech-transcriber
   ```
3. Access the visual dashboard at **`http://localhost:8000`**.
