# Audio-Speech-Transcriber

## 1. Project Overview

A speech-to-text service: a FastAPI backend exposes a transcription endpoint, and a React + Vite frontend provides a dashboard to try it.

**Known limitation:** the current `WhisperService` implementation (`backend/app/services/transcribe_audio_speech.py`) returns a fixed, hardcoded transcript with simulated token timestamps — it does not yet run a real Whisper model. `requirements.txt` includes `transformers`, so wiring in an actual model is the natural next step.

## 2. Core Features

- FastAPI backend with a versioned API (`app/api/v1`) and a transcription service layer
- React 18 + Vite single-page frontend dashboard
- Backend serves the built frontend as static files when `frontend/dist` exists, so the whole app runs as one process
- `mcp_server.py`: a stdio JSON-RPC Model Context Protocol server exposing a `transcribe_audio_speech` tool so AI agents/clients can call the service directly
- Multi-stage Dockerfile (Node build stage + Python runtime stage) for a single deployable image

## 3. Tech Stack

| Component | Technology |
|---|---|
| Backend | FastAPI, Uvicorn, Pydantic |
| Declared (not yet wired) | Transformers, NumPy, Pandas, scikit-learn |
| Frontend | React 18, Vite |
| Packaging | Docker (multi-stage: `node:18-alpine` build + `python:3.10-slim` runtime) |

## 4. Project Structure

```
Audio-Speech-Transcriber/
├── frontend/           # React 18 + Vite client
│   ├── src/App.jsx
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── core/       # configuration
│   │   ├── api/v1/     # routes
│   │   └── services/   # transcription logic
│   ├── mcp_server.py   # MCP stdio server
│   ├── app.py          # entrypoint used by the Docker image
│   └── requirements.txt
├── Dockerfile
└── .dockerignore
```

## 5. Prerequisites

- Python 3.10+
- Node.js 18+ (for frontend dev/build)
- Docker (optional, for the packaged image)

## 6. How to Run

### Local development

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

In a separate terminal, for frontend dev with hot reload:

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker build -t audio-speech-transcriber .
docker run -p 8000:8000 audio-speech-transcriber
```

Then open `http://localhost:8000`.

## 7. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/run` | Accepts an audio file upload and returns the (currently hardcoded) transcript with simulated timestamps. |
| GET | `/` | Serves the built frontend, when present. |

## 8. Environment Variables

None required — the service has no external API keys or configurable settings in `app/core/config.py` beyond the fixed `API_V1_STR` prefix.

## 9. Known Limitations

- Transcription is a hardcoded stub, not a real Whisper model inference call.
- No automated tests currently exist in the repository (`backend/test/` is present but empty).

## License

No LICENSE file is present in this repository.
