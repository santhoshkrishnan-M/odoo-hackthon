# GlobeTrotter – Travel Planning Platform 

GlobeTrotter is a scalable and modular FastAPI backend designed for a modern travel planning application.  
It provides a clean REST API for managing users, trips, itineraries, budgets, and administrative insights, built with real-world production practices in mind.

This backend is structured for extensibility, maintainability, and team collaboration.

---

## Overview

GlobeTrotter enables users to:
- Register and authenticate securely
- Create and manage trips
- Plan and organize itineraries
- Track travel-related budgets
- Access admin-level system insights

The backend follows clean architecture principles with strict separation of concerns.

---

## Features

- 22 RESTful API endpoints
- JWT-based authentication (access and refresh tokens)
- Modular feature-based architecture
- PostgreSQL database with SQLAlchemy ORM
- Pydantic v2 for request and response validation
- Alembic-powered database migrations
- Docker and Docker Compose support
- Swagger/OpenAPI documentation
- Ready for frontend or mobile app integration

---

## Project Structure

```
globetrotter/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── trips/
│   │   ├── itinerary/
│   │   ├── budget/
│   │   ├── admin/
│   │   └── shared/
│   ├── alembic/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── README.md
│   └── .env.example
├── frontend/
├── docs/
│   ├── API.md
│   └── BACKEND_SETUP.md
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Tech Stack

- Python 3.10+
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic v2
- Alembic
- JWT Authentication
- Docker and Docker Compose

---

## API Endpoints

### Authentication (4)
- Register
- Login
- Refresh token
- Logout

### Users (4)
- Get current user
- Update user profile
- Get user by ID
- Delete user

### Trips (5)
- List trips
- Create trip
- Get trip details
- Update trip
- Delete trip

### Itinerary (4)
- Get itinerary
- Add itinerary item
- Update itinerary item
- Delete itinerary item

### Admin (3)
- List all users
- List all trips
- Platform statistics

### Shared (2)
- Root health check
- System health check

Total: 22 API endpoints

---

## Module Design Pattern

Each feature module follows this structure:

```
module/
├── router.py
├── schemas.py
├── models.py
└── service.py
```

This ensures clear separation of concerns, easier testing, and scalable development.

---

## Getting Started

### Using Docker (Recommended)

```bash
docker-compose up -d
```

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

---

### Local Development Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux / macOS
venv\Scripts\activate         # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Environment Variables

Create a `.env` file using `.env.example` as reference.

```env
DATABASE_URL=postgresql://user:password@localhost:5432/globetrotter
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

---

## Database and Migrations

ORM models are defined in:
- backend/app/users/models.py
- backend/app/trips/models.py
- backend/app/itinerary/models.py

Alembic is used for database migrations and schema versioning.

---

## Documentation

- Backend Setup Guide: docs/BACKEND_SETUP.md
- API Reference: docs/API.md
- Interactive API Docs: /docs

---

## Development Notes

- Endpoints currently return placeholder responses
- Business logic can be implemented incrementally
- Architecture supports future RBAC and feature expansion
- Suitable for production hardening and CI/CD pipelines

---

## License

This project is intended for educational and development purposes.  
Add a LICENSE file if you plan to distribute or open-source this project.


**For detailed setup, see [Backend Setup Guide](docs/BACKEND_SETUP.md)**

