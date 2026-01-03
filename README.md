# GlobeTrotter API - Travel Planning Backend

A secure, production-ready FastAPI backend for a travel planning web application.

## Tech Stack

- **Framework**: FastAPI 0.109.0
- **Server**: Uvicorn with async support
- **Database**: PostgreSQL with SQLAlchemy 2.0 (async)
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Pydantic v2
- **Password Hashing**: bcrypt via passlib
- **Migrations**: Alembic
- **Logging**: Python logging module

## Installation

1. **Create virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Run application**
```bash
python run.py
```

## API Documentation

Access at http://localhost:8000/docs

## License

MIT
