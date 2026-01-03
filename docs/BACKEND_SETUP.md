# Backend Setup Guide

## 🚀 Quick Setup

### Step 1: Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Environment Configuration
```bash
# Copy example env file
cp .env.example .env

# Edit with your settings
# Minimum required:
# - DATABASE_URL
# - SECRET_KEY
```

### Step 4: Database Setup

#### Option A: Local PostgreSQL
```bash
# Make sure PostgreSQL is running
# Create database
createdb globetrotter

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/globetrotter
```

#### Option B: Docker Compose
```bash
# From project root
docker-compose up -d postgres

# This starts PostgreSQL on localhost:5432
```

### Step 5: Run Migrations
```bash
cd backend
alembic upgrade head
```

### Step 6: Start Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Server running at: `http://localhost:8000`

📖 API Docs: `http://localhost:8000/docs`

## 🐳 Using Docker Compose

Start entire stack (PostgreSQL + Backend):
```bash
# From project root
docker-compose up -d

# Backend available at http://localhost:8000
# PostgreSQL available at localhost:5432
```

View logs:
```bash
docker-compose logs -f backend
docker-compose logs -f postgres
```

Stop services:
```bash
docker-compose down
```

## 📝 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                # FastAPI app entry point
│   ├── core/
│   │   ├── config.py          # Environment config
│   │   ├── database.py        # SQLAlchemy setup
│   │   ├── security.py        # JWT utilities
│   │   └── __init__.py
│   ├── auth/                  # Authentication
│   ├── users/                 # User management
│   ├── trips/                 # Trip management
│   ├── itinerary/             # Itinerary planning
│   ├── budget/                # Budget tracking
│   ├── admin/                 # Admin endpoints
│   └── shared/                # Shared endpoints
├── alembic/                   # Database migrations
├── requirements.txt
├── .env.example
├── Dockerfile
└── README.md
```

## ⚙️ Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/globetrotter

# JWT Security
SECRET_KEY=your-secret-key-minimum-32-chars-recommended
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Debug
DEBUG=True
```

## 🔧 Development Tips

### Hot Reload
The `--reload` flag enables automatic restart on file changes:
```bash
uvicorn app.main:app --reload
```

### Database Migrations

Create new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback:
```bash
alembic downgrade -1
```

## 🧪 Testing

```bash
# Run tests (when available)
pytest

# With coverage
pytest --cov=app
```

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Test connection: `psql <DATABASE_URL>`

### Import Errors
- Ensure virtual environment is activated
- Run: `pip install -r requirements.txt`
- Check Python version: `python --version` (requires 3.10+)

### Port Already in Use
```bash
# Use different port
uvicorn app.main:app --port 8001
```

### Module Not Found
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

## 📚 Next Steps

1. ✅ Backend is running
2. 🔗 Frontend team: Connect to `http://localhost:8000`
3. 📖 Check [API.md](API.md) for endpoints
4. 🛠️ Implement business logic in services

---

**Happy coding! 🚀**
