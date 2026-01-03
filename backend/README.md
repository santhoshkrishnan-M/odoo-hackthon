# GlobeTrotter Backend

FastAPI-based REST API for the GlobeTrotter travel planning application.

## 📋 Quick Overview

- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic (initialized)
- **Auth**: JWT scaffolding
- **Type Safety**: Full type hints with Pydantic v2

## 🚀 Getting Started

### 1. Setup Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux  
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# .env file is already created with defaults
# Update DATABASE_URL if needed
```

### 4. Start Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Server: http://localhost:8000
📖 Swagger UI: http://localhost:8000/docs
📘 ReDoc: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app & router registration
│   ├── core/
│   │   ├── config.py           # Environment configuration
│   │   ├── database.py         # SQLAlchemy setup
│   │   ├── security.py         # JWT utilities (placeholder)
│   │   └── __init__.py
│   ├── auth/                   # Authentication module
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── service.py
│   │   └── __init__.py
│   ├── users/                  # User management
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── service.py
│   │   └── __init__.py
│   ├── trips/                  # Trip management
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── service.py
│   │   └── __init__.py
│   ├── itinerary/              # Itinerary planning
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── service.py
│   │   └── __init__.py
│   ├── budget/                 # Budget tracking
│   │   ├── service.py
│   │   └── __init__.py
│   ├── admin/                  # Admin endpoints
│   │   ├── router.py
│   │   └── __init__.py
│   └── shared/                 # Shared endpoints
│       ├── router.py
│       └── __init__.py
├── alembic/                    # Database migrations
│   ├── versions/
│   ├── env.py
│   ├── script.py.mako
│   └── alembic.ini
├── .env                        # Local environment variables
├── .env.example                # Template for .env
├── requirements.txt
├── Dockerfile
└── README.md
```

## 🔗 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /refresh` - Refresh token
- `POST /logout` - User logout

### Users (`/api/v1/users`)
- `GET /me` - Current user profile
- `PUT /me` - Update profile
- `GET /{user_id}` - Get user by ID
- `DELETE /{user_id}` - Delete user

### Trips (`/api/v1/trips`)
- `GET` - List user trips
- `POST` - Create trip
- `GET /{trip_id}` - Get trip details
- `PUT /{trip_id}` - Update trip
- `DELETE /{trip_id}` - Delete trip

### Itinerary (`/api/v1/itinerary`)
- `GET /trips/{trip_id}` - Get itinerary
- `POST /trips/{trip_id}` - Add item
- `PUT /{item_id}` - Update item
- `DELETE /{item_id}` - Delete item

### Admin (`/api/v1/admin`)
- `GET /users` - List all users
- `GET /trips` - List all trips
- `GET /stats` - System statistics

### Shared (`/api/v1/shared`)
- `GET /health` - Health check

## 🛠️ Development

### File Organization Pattern

Each module follows this pattern:
```
module/
├── router.py          # FastAPI router with endpoints
├── schemas.py         # Pydantic request/response schemas
├── models.py          # SQLAlchemy ORM models (if applicable)
├── service.py         # Business logic (placeholder)
└── __init__.py        # Package initialization
```

### Adding New Endpoints

1. **Update `schemas.py`** with request/response models
2. **Add endpoint to `router.py`** with proper type hints
3. **Implement service logic in `service.py`**
4. **Router auto-registers** in `main.py`

Example:
```python
# In app/trips/router.py
from fastapi import APIRouter
from app.trips import schemas

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("", response_model=list[schemas.TripResponse])
async def list_trips():
    """List all user trips."""
    return {"message": "Not implemented"}
```

### Database Operations

```python
from app.core.database import get_db

@router.get("/{user_id}")
async def get_user(user_id: int, db = Depends(get_db)):
    # Use db.query(User).filter(...).first()
    pass
```

## 🗄️ Database Management

### Create Tables

```python
# Tables are auto-created on app startup
# Or manually: Base.metadata.create_all(bind=engine)
```

### Migrations

When ready to use Alembic:

```bash
# Create new migration
alembic revision --autogenerate -m "Add user table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 🔐 Security (Placeholders)

JWT utilities are available in `app/core/security.py`:
- `generate_token(data)` - Create JWT
- `verify_token(token)` - Validate JWT
- `hash_password(password)` - Hash password
- `verify_password(plain, hashed)` - Verify password

Usage:
```python
from app.core.security import generate_token, verify_token

token = generate_token({"sub": "user@example.com"})
payload = verify_token(token)
```

## 📚 Configuration

All config loaded from `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/globetrotter
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

Access in code:
```python
from app.core.config import settings

print(settings.DATABASE_URL)
print(settings.SECRET_KEY)
```

## 🐳 Docker

### Build Image

```bash
docker build -t globetrotter-api .
```

### Run Container

```bash
docker run -e DATABASE_URL="postgresql://user:pwd@host:5432/db" \
           -p 8000:8000 \
           globetrotter-api
```

### Docker Compose

From project root:
```bash
docker-compose up -d
```

## 🚨 Common Issues

### Import Errors

```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

### Database Connection

```bash
# Verify PostgreSQL is running
psql <DATABASE_URL>

# Check .env DATABASE_URL
```

### Port Already in Use

```bash
# Use different port
uvicorn app.main:app --port 8001
```

## 📝 Next Steps

1. ✅ Backend running with placeholders
2. 📖 Review [../docs/API.md](../docs/API.md)
3. 🔗 Coordinate with frontend on API contract
4. 🛠️ Implement business logic in service classes
5. 📊 Create Alembic migrations for your schema changes

## 🤝 Contributing

- Keep API contracts in sync with `/docs/API.md`
- Use type hints everywhere
- Add TODO comments for unimplemented sections
- Test endpoints in Swagger UI
- Communicate schema changes with frontend team

## 📞 Support

- API Docs: http://localhost:8000/docs
- Setup Help: See [../docs/BACKEND_SETUP.md](../docs/BACKEND_SETUP.md)
- Issues: Check GitHub issues or ask in team chat

---

**Happy coding! 🚀**
