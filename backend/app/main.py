from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, users, trips, cities, activities, itinerary, budgets, shared, websocket
from app.middleware import error_handler_middleware
from app.utils.logger import logger


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

app.middleware("http")(error_handler_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(users.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(trips.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(cities.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(activities.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(itinerary.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(budgets.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(shared.router, prefix=f"/api/{settings.API_VERSION}")
app.include_router(websocket.router, prefix=f"/api/{settings.API_VERSION}", tags=["WebSocket"])


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.API_VERSION,
        "status": "running",
        "features": {
            "rest_api": True,
            "real_time_websocket": True
        },
        "websocket_endpoints": {
            "user_connection": f"/api/{settings.API_VERSION}/ws/{{user_id}}",
            "trip_collaboration": f"/api/{settings.API_VERSION}/ws/trip/{{trip_id}}?user_id={{user_id}}",
            "stats": f"/api/{settings.API_VERSION}/ws/stats"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.on_event("startup")
async def startup_event():
    logger.info(f"{settings.APP_NAME} started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"{settings.APP_NAME} shutting down")
