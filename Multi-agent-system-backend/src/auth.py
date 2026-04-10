# C:\Users\nikit\WebstormProjects\CTRL-VIBE\Multi-agent-system-backend\src\auth.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import jwt
from datetime import datetime, timedelta
import bcrypt

# Создаем роутер
auth_router = APIRouter(prefix="/auth", tags=["auth"])

# Секретный ключ для JWT (в продакшене используй переменные окружения)
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Модели данных
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str

class AuthResponse(BaseModel):
    token: str
    user: User

# Временное хранилище пользователей (в продакшене используй базу данных)
users_db = {}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

@auth_router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    # Проверяем существование пользователя
    if request.email not in users_db:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    user_data = users_db[request.email]

    # Проверяем пароль
    if not verify_password(request.password, user_data["password"]):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    # Создаем JWT токен
    token_data = {
        "sub": user_data["id"],
        "email": user_data["email"],
        "name": user_data["name"],
        "role": user_data["role"]
    }
    token = create_access_token(token_data)

    return AuthResponse(
        token=token,
        user=User(
            id=user_data["id"],
            name=user_data["name"],
            email=user_data["email"],
            role=user_data["role"]
        )
    )

@auth_router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    # Проверяем, не существует ли уже пользователь
    if request.email in users_db:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

    # Хешируем пароль
    hashed_password = hash_password(request.password)

    # Создаем ID пользователя
    user_id = str(len(users_db) + 1)

    # Сохраняем пользователя
    users_db[request.email] = {
        "id": user_id,
        "name": request.name,
        "email": request.email,
        "password": hashed_password,
        "role": "user"
    }

    # Создаем JWT токен
    token_data = {
        "sub": user_id,
        "email": request.email,
        "name": request.name,
        "role": "user"
    }
    token = create_access_token(token_data)

    return AuthResponse(
        token=token,
        user=User(
            id=user_id,
            name=request.name,
            email=request.email,
            role="user"
        )
    )

@auth_router.get("/me")
async def get_current_user():
    # Временная заглушка - в реальном приложении нужно проверять токен
    return {"message": "User profile endpoint"}