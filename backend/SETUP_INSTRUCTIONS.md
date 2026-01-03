# GlobeTrotter Backend Setup Instructions

## Step 1: PostgreSQL Database Setup

```bash
# Install PostgreSQL (if not installed)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE globetrotter WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8';
CREATE USER globetrotter_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE globetrotter TO globetrotter_user;
\c globetrotter
GRANT ALL ON SCHEMA public TO globetrotter_user;
EOF

# Verify connection
psql -U globetrotter_user -d globetrotter -h localhost -W
```

## Step 2: Update .env File

```bash
cd /home/santhosh-krishnan-m/Desktop/New\ Folder/odoo-hackthon
```

Edit `.env`:
```env
# Application
ENV=development
DEBUG=true
APP_NAME=GlobeTrotter API
API_VERSION=v1

# Server
HOST=0.0.0.0
PORT=8000

# Database (UPDATE THESE)
DATABASE_URL=postgresql+asyncpg://globetrotter_user:your_secure_password_here@localhost:5432/globetrotter

# JWT Secrets (GENERATE NEW ONES)
JWT_SECRET_KEY=$(openssl rand -hex 32)
JWT_REFRESH_SECRET_KEY=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

Generate JWT secrets:
```bash
echo "JWT_SECRET_KEY=$(openssl rand -hex 32)"
echo "JWT_REFRESH_SECRET_KEY=$(openssl rand -hex 32)"
```

## Step 3: Configure Alembic for Async SQLAlchemy

Replace `/alembic/env.py`:

```python
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Import your Base and models
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.database import Base
from app.config import settings

# Import all models for autogenerate
from app.models.user import User
from app.models.trip import Trip
from app.models.city import City
from app.models.activity import Activity
from app.models.itinerary_day import ItineraryDay
from app.models.itinerary_item import ItineraryItem
from app.models.budget import Budget
from app.models.shared_trip import SharedTrip

# this is the Alembic Config object
config = context.config

# Set sqlalchemy.url from settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations in 'online' mode."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

## Step 4: Generate and Run Migrations

```bash
cd /home/santhosh-krishnan-m/Desktop/New\ Folder/odoo-hackthon

# Generate initial migration
./venv/bin/alembic revision --autogenerate -m "Initial migration with all models"

# Review migration file in alembic/versions/

# Apply migrations
./venv/bin/alembic upgrade head

# Verify tables created
psql -U globetrotter_user -d globetrotter -h localhost -c "\dt"
```

## Step 5: Start Server

```bash
cd /home/santhosh-krishnan-m/Desktop/New\ Folder/odoo-hackthon
./venv/bin/python run.py
```

Server runs at: `http://0.0.0.0:8000`

## Step 6: Test Endpoints via Swagger UI

Open browser: `http://localhost:8000/docs`

### Test Authentication Flow:

**1. Sign Up:**
```json
POST /api/v1/auth/signup
{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "full_name": "Test User"
}

Expected Response:
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "user",
    "is_active": true,
    "created_at": "2026-01-03T11:00:00"
  },
  "error": null
}
```

**2. Login:**
```json
POST /api/v1/auth/login
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}

Expected Response:
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer"
  },
  "error": null
}
```

**3. Get Current User (use access_token):**
```json
GET /api/v1/users/me
Authorization: Bearer <access_token>

Expected Response:
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "user",
    "is_active": true,
    "created_at": "2026-01-03T11:00:00"
  },
  "error": null
}
```

**4. Create Trip:**
```json
POST /api/v1/trips
Authorization: Bearer <access_token>
{
  "title": "Summer Vacation",
  "description": "Trip to Europe",
  "start_date": "2026-07-01",
  "end_date": "2026-07-15",
  "destination": "Paris, France"
}

Expected Response:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Summer Vacation",
    "description": "Trip to Europe",
    "start_date": "2026-07-01",
    "end_date": "2026-07-15",
    "destination": "Paris, France",
    "created_at": "2026-01-03T11:00:00"
  },
  "error": null
}
```

### Verify Response Format:

All endpoints return:
```json
{
  "success": boolean,
  "data": any | null,
  "error": string | null
}
```

### Test All Endpoints:
- ✅ Authentication: `/api/v1/auth/*`
- ✅ Users: `/api/v1/users/*`
- ✅ Trips: `/api/v1/trips/*`
- ✅ Cities: `/api/v1/cities/*`
- ✅ Activities: `/api/v1/activities/*`
- ✅ Itinerary: `/api/v1/itinerary/*`
- ✅ Budgets: `/api/v1/budgets/*`
- ✅ Shared: `/api/v1/shared/*`

## Common Commands

```bash
# Check database
psql -U globetrotter_user -d globetrotter -h localhost

# View tables
\dt

# View table structure
\d users

# Check migrations
./venv/bin/alembic current

# Rollback migration
./venv/bin/alembic downgrade -1

# View migration history
./venv/bin/alembic history

# Generate new migration after model changes
./venv/bin/alembic revision --autogenerate -m "Description"

# Apply migrations
./venv/bin/alembic upgrade head
```
