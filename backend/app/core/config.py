from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Audio-Speech-Transcriber API"

settings = Settings()
