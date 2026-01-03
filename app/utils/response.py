from typing import Optional, Any


class ApiResponse:
    @staticmethod
    def success(data: Any, message: Optional[str] = None) -> dict:
        response = {
            "success": True,
            "data": data,
            "error": None
        }
        if message:
            response["message"] = message
        return response
    
    @staticmethod
    def error(error: str, data: Any = None) -> dict:
        return {
            "success": False,
            "data": data,
            "error": error
        }
