import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(title=settings.PROJECT_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.API_V1_STR)

frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    @app.get("/{rest_of_path:path}", response_class=HTMLResponse)
    async def serve_frontend(rest_of_path: str):
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            with open(index_file, "r") as f:
                return f.read()
        return "Index.html not found."
else:
    @app.get("/")
    async def index():
        return {"message": "API is Online!"}
