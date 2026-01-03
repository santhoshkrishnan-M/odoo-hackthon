"""
Main FastAPI application.
Entry point for GlobeTrotter API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.database import Base, engine

# Import all routers
from app.auth import router as auth_router
from app.users import router as users_router
from app.trips import router as trips_router
from app.itinerary import router as itinerary_router
from app.admin import router as admin_router
from app.shared import router as shared_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Travel planning application API",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/", tags=["Root"])
async def root() -> dict:
    """
    Root endpoint - health check.
    """
    return {
        "status": "ok",
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
    }


# Include routers with API v1 prefix
API_V1_PREFIX = "/api/v1"

app.include_router(auth_router.router, prefix=API_V1_PREFIX)
app.include_router(users_router.router, prefix=API_V1_PREFIX)
app.include_router(trips_router.router, prefix=API_V1_PREFIX)
app.include_router(itinerary_router.router, prefix=API_V1_PREFIX)
app.include_router(admin_router.router, prefix=API_V1_PREFIX)
app.include_router(shared_router.router, prefix=API_V1_PREFIX)


@app.on_event("startup")
async def startup_event() -> None:
    """Run on application startup."""
    logger.info(f"🚀 {settings.APP_NAME} API v{settings.APP_VERSION} starting...")


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Run on application shutdown."""
    logger.info(f"🛑 {settings.APP_NAME} API shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
