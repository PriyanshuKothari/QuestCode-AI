from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.game import router as game_router
from api.routes.session import router as session_router

app = FastAPI(title="CodeQuest API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game_router, prefix="/api")
app.include_router(session_router, prefix="/api")

@app.get("/")
def health_check():
    return{
        "status": "ok",
        "message": "CodeQuest API is running"
    }



