# C:\Users\nikit\WebstormProjects\CTRL-VIBE\Multi-agent-system-backend\src\server.py

from fastapi import FastAPI
from fastapi._middleware.cors import CORSMiddleware
from src.auth import auth_router

app = FastAPI(title="NEXUS Backend")

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "NEXUS API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}