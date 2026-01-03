"""
WebSocket connection manager for real-time data streaming.
Handles WebSocket connections, broadcasting, and room management.
"""
from typing import Dict, List, Set
from fastapi import WebSocket
import json
import asyncio
from datetime import datetime


class ConnectionManager:
    """Manages WebSocket connections and broadcasting."""
    
    def __init__(self):
        # Store active connections by user_id
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Store connections by room/trip_id for group broadcasts
        self.rooms: Dict[str, Set[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)
        
    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove a WebSocket connection."""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            
            # Clean up empty user entries
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        # Remove from all rooms
        for room_connections in self.rooms.values():
            room_connections.discard(websocket)
    
    async def join_room(self, websocket: WebSocket, room_id: str):
        """Add a connection to a room (e.g., trip room)."""
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        
        self.rooms[room_id].add(websocket)
    
    async def leave_room(self, websocket: WebSocket, room_id: str):
        """Remove a connection from a room."""
        if room_id in self.rooms:
            self.rooms[room_id].discard(websocket)
            
            # Clean up empty rooms
            if not self.rooms[room_id]:
                del self.rooms[room_id]
    
    async def send_personal_message(self, message: dict, user_id: str):
        """Send a message to a specific user's connections."""
        if user_id in self.active_connections:
            message["timestamp"] = datetime.utcnow().isoformat()
            message_json = json.dumps(message)
            
            disconnected = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message_json)
                except Exception:
                    disconnected.append(connection)
            
            # Clean up disconnected websockets
            for conn in disconnected:
                self.disconnect(conn, user_id)
    
    async def broadcast_to_room(self, message: dict, room_id: str):
        """Broadcast a message to all connections in a room."""
        if room_id in self.rooms:
            message["timestamp"] = datetime.utcnow().isoformat()
            message_json = json.dumps(message)
            
            disconnected = []
            for connection in self.rooms[room_id]:
                try:
                    await connection.send_text(message_json)
                except Exception:
                    disconnected.append(connection)
            
            # Clean up disconnected websockets
            for conn in disconnected:
                self.rooms[room_id].discard(conn)
    
    async def broadcast_all(self, message: dict):
        """Broadcast a message to all active connections."""
        message["timestamp"] = datetime.utcnow().isoformat()
        message_json = json.dumps(message)
        
        for user_connections in self.active_connections.values():
            for connection in user_connections:
                try:
                    await connection.send_text(message_json)
                except Exception:
                    pass
    
    def get_active_users_count(self) -> int:
        """Get count of active users."""
        return len(self.active_connections)
    
    def get_room_users_count(self, room_id: str) -> int:
        """Get count of users in a specific room."""
        return len(self.rooms.get(room_id, set()))


# Global connection manager instance
manager = ConnectionManager()
