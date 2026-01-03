from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.utils import ApiResponse
from app.utils.logger import logger


async def error_handler_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ApiResponse.error("Internal server error")
        )
