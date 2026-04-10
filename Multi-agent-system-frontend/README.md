# NEXUS — Платформа управления проектами

NEXUS — это высокотехнологичная платформа для управления социальными проектами Яндекса. Система включает в себя AI-пайплайн для анализа заявок, инструменты управления проектами (Kanban, репозиторий, инфраструктура) и портал для студентов.

## Технологический стек
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM + Multi-Agent Python Backend ([репозиторий](https://github.com/Podoroj-nik/Multi-agent-system))
- **Database**: PostgreSQL (или SQLite для демо)
- **Auth**: NextAuth.js (JWT RS256, BCrypt)
- **State**: Zustand, TanStack Query
- **AI**: Интеграция с Multi-Agent Python Backend

## Быстрый старт

### 1. Подготовка окружения
Убедитесь, что у вас установлены Node.js (v18+) и PostgreSQL.

Создайте файл `.env` (он был сгенерирован автоматически скриптом setup-security):
```env
DATABASE_URL="postgresql://postgres:user@localhost:5432/nexus"
ENCRYPTION_KEY="..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
JWT_PRIVATE_KEY="..."
JWT_PUBLIC_KEY="..."
AGENT_BACKEND_URL="http://127.0.0.1:8000/process_step"
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка базы данных
```bash
npx prisma generate
npx prisma db push
```

### 4. Запуск приложения
```bash
npm run dev
```

### 5. Запуск AI-бекенда
Клонируйте и запустите Multi-Agent Python Backend из [репозитория](https://github.com/Podoroj-nik/Multi-agent-system). Убедитесь, что бекенд запущен на порту 8000:
```bash
git clone https://github.com/Podoroj-nik/Multi-agent-system.git
cd Multi-agent-system
python server.py
```

## Функциональные возможности
- **Подача заявок**: Многошаговая форма с валидацией (Zod).
- **AI-пайплайн**: Автоматический скоринг, исследование и планирование проекта.
- **Mock Tracker**: Интерфейс администратора в стиле Yandex Tracker.
- **Kanban**: Управление задачами с Drag-and-drop.
- **Профиль студента**: Редактор навыков и AI-матчинг.
- **Инфраструктура**: Симуляция нарезки ресурсов в Yandex Cloud.

## Безопасность
- **AES-256-GCM**: Все персональные данные (email, контакты) зашифрованы в БД.
- **JWT RS256**: Подпись токенов асимметричным ключом.
- **Rate Limiting**: Защита от брутфорса на уровне API.
- **CSP**: Настроенные заголовки безопасности в `next.config.ts`.
