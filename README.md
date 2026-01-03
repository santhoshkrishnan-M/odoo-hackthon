# GlobeTrotter - Travel Planning App

FastAPI backend for a travel planning application.

## 🏗️ Project Structure

```
globetrotter/
├── backend/               # FastAPI Backend
│   ├── app/
│   │   ├── main.py       # FastAPI application
│   │   ├── core/         # Config, database, security
│   │   ├── auth/         # Authentication
│   │   ├── users/        # User management
│   │   ├── trips/        # Trip management
│   │   ├── itinerary/    # Itinerary planning
│   │   ├── budget/       # Budget tracking
│   │   ├── admin/        # Admin endpoints
│   │   └── shared/       # Shared endpoints
│   ├── alembic/          # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
├── frontend/             # Frontend application
├── docs/
│   ├── API.md           # API endpoints
│   └── BACKEND_SETUP.md # Setup guide
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
docker-compose up -d
```

### Local Development
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**API**: http://localhost:8000  
**Swagger UI**: http://localhost:8000/docs

## 📚 Documentation

- [Backend Setup](docs/BACKEND_SETUP.md) - Detailed setup instructions
- [API Reference](docs/API.md) - API endpoints
- [Backend README](backend/README.md) - Backend details

## ✨ Features

- **22 REST API Endpoints** - Auth, Users, Trips, Itinerary, Admin
- **Database Models** - User, Trip, Itinerary with SQLAlchemy
- **Type Safety** - Full type hints with Pydantic v2
- **Docker Ready** - Complete docker-compose setup
- **Clean Architecture** - Separated routers, schemas, services, models

## 🛠️ Tech Stack

- FastAPI
- PostgreSQL + SQLAlchemy
- Pydantic v2
- Alembic (migrations)
- JWT (authentication scaffold)
- Docker

## 📖 API Endpoints (22 Total)

**Auth** (4): login, register, refresh, logout  
**Users** (4): get_me, update_me, get_user, delete_user  
**Trips** (5): list, create, get, update, delete  
**Itinerary** (4): get, add, update, delete  
**Admin** (3): list_users, list_trips, get_stats  
**Shared** (1): health_check  
**Root** (1): health_check  

## 📝 Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/globetrotter
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

See `.env.example` for template.

## 🔄 Database

Models are defined in:
- `backend/app/users/models.py`
- `backend/app/trips/models.py`
- `backend/app/itinerary/models.py`

Migrations via Alembic (initialized in `backend/alembic/`).

## 📝 Development

Each module follows this structure:
- `router.py` - FastAPI endpoints
- `schemas.py` - Pydantic models for validation
- `models.py` - SQLAlchemy ORM models
- `service.py` - Business logic

All endpoints return placeholders - ready for implementation.

---

**For detailed setup, see [Backend Setup Guide](docs/BACKEND_SETUP.md)**

