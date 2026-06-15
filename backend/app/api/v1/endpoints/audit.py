from fastapi import APIRouter, UploadFile, File
from app.services.transcribe_audio_speech import WhisperService
router = APIRouter()
@router.post("/run")
async def run_api(file: UploadFile = File(...)):
    return {"success": True, "result": WhisperService().execute(file.filename)}