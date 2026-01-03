"""
WebSocket routes for real-time data streaming.
Provides real-time updates for trips, itineraries, budgets, and collaborative features.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from app.websocket_manager import manager
from typing import Optional
import json


router = APIRouter()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str
):
    """
    Main WebSocket endpoint for real-time connections.
    
    Handles:
    - Personal notifications
    - Trip updates
    - Itinerary changes
    - Budget updates
    - Collaborative editing signals
    """
    await manager.connect(websocket, user_id)
    
    try:
        # Send connection confirmation
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "user_id": user_id,
            "message": "WebSocket connection established"
        })
        
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            message_type = message.get("type")
            
            if message_type == "ping":
                # Heartbeat
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": message.get("timestamp")
                })
            
            elif message_type == "join_trip":
                # Join a trip room for collaborative updates
                trip_id = message.get("trip_id")
                if trip_id:
                    await manager.join_room(websocket, f"trip_{trip_id}")
                    await manager.broadcast_to_room({
                        "type": "user_joined",
                        "user_id": user_id,
                        "trip_id": trip_id
                    }, f"trip_{trip_id}")
            
            elif message_type == "leave_trip":
                # Leave a trip room
                trip_id = message.get("trip_id")
                if trip_id:
                    await manager.leave_room(websocket, f"trip_{trip_id}")
                    await manager.broadcast_to_room({
                        "type": "user_left",
                        "user_id": user_id,
                        "trip_id": trip_id
                    }, f"trip_{trip_id}")
            
            elif message_type == "trip_update":
                # Broadcast trip update to all users in that trip
                trip_id = message.get("trip_id")
                if trip_id:
                    await manager.broadcast_to_room({
                        "type": "trip_updated",
                        "trip_id": trip_id,
                        "data": message.get("data"),
                        "updated_by": user_id
                    }, f"trip_{trip_id}")
            
            elif message_type == "itinerary_update":
                # Broadcast itinerary update
                trip_id = message.get("trip_id")
                if trip_id:
                    await manager.broadcast_to_room({
                        "type": "itinerary_updated",
                        "trip_id": trip_id,
                        "data": message.get("data"),
                        "updated_by": user_id
                    }, f"trip_{trip_id}")
            
            elif message_type == "budget_update":
                # Broadcast budget update
                trip_id = message.get("trip_id")
                if trip_id:
                    await manager.broadcast_to_room({
                        "type": "budget_updated",
                        "trip_id": trip_id,
                        "data": message.get("data"),
                        "updated_by": user_id
                    }, f"trip_{trip_id}")
            
            elif message_type == "activity_update":
                # Broadcast activity update
                trip_id = message.get("trip_id")
                if trip_id:
                    await manager.broadcast_to_room({
                        "type": "activity_updated",
                        "trip_id": trip_id,
                        "data": message.get("data"),
                        "updated_by": user_id
                    }, f"trip_{trip_id}")
            
            elif message_type == "typing":
                # Broadcast typing indicator
                trip_id = message.get("trip_id")
                if trip_id:
                    await manager.broadcast_to_room({
                        "type": "user_typing",
                        "trip_id": trip_id,
                        "user_id": user_id,
                        "field": message.get("field")
                    }, f"trip_{trip_id}")
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        # Notify all trip rooms that user disconnected
        for room_id, connections in manager.rooms.items():
            if websocket in connections:
                await manager.broadcast_to_room({
                    "type": "user_disconnected",
                    "user_id": user_id
                }, room_id)
    
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {str(e)}")
        manager.disconnect(websocket, user_id)


@router.websocket("/ws/trip/{trip_id}")
async def trip_websocket(
    websocket: WebSocket,
    trip_id: str,
    user_id: Optional[str] = Query(None)
):
    """
    WebSocket endpoint specifically for trip collaboration.
    Auto-joins the trip room on connection.
    """
    if not user_id:
        await websocket.close(code=1008, reason="user_id required")
        return
    
    await manager.connect(websocket, user_id)
    await manager.join_room(websocket, f"trip_{trip_id}")
    
    try:
        # Send connection confirmation
        await websocket.send_json({
            "type": "trip_connection",
            "status": "connected",
            "trip_id": trip_id,
            "user_id": user_id,
            "active_users": manager.get_room_users_count(f"trip_{trip_id}")
        })
        
        # Notify others
        await manager.broadcast_to_room({
            "type": "user_joined_trip",
            "user_id": user_id,
            "trip_id": trip_id
        }, f"trip_{trip_id}")
        
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast any message to all users in the trip
            message["user_id"] = user_id
            message["trip_id"] = trip_id
            await manager.broadcast_to_room(message, f"trip_{trip_id}")
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        await manager.leave_room(websocket, f"trip_{trip_id}")
        await manager.broadcast_to_room({
            "type": "user_left_trip",
            "user_id": user_id,
            "trip_id": trip_id
        }, f"trip_{trip_id}")
    
    except Exception as e:
        print(f"Trip WebSocket error: {str(e)}")
        manager.disconnect(websocket, user_id)


@router.get("/ws/stats")
async def websocket_stats():
    """Get real-time WebSocket connection statistics."""
    return {
        "active_users": manager.get_active_users_count(),
        "active_rooms": len(manager.rooms),
        "rooms": {
            room_id: manager.get_room_users_count(room_id)
            for room_id in manager.rooms.keys()
        }
    }
