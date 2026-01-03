# Real-Time WebSocket Features

## Overview
GlobeTrotter now supports **real-time data streaming** using WebSocket connections. This enables collaborative trip planning with live updates across all connected users.

## Features

### ✨ Real-Time Capabilities
- **Live Trip Updates**: See changes to trip details instantly
- **Collaborative Itinerary Editing**: Multiple users can edit itineraries simultaneously
- **Real-Time Budget Tracking**: Budget updates broadcast to all trip participants
- **Activity Updates**: Live activity modifications
- **User Presence**: See who's currently viewing/editing a trip
- **Typing Indicators**: Know when others are editing

## WebSocket Endpoints

### 1. User Connection
```
ws://localhost:8000/api/v1/ws/{user_id}
```
Main WebSocket endpoint for user-specific real-time updates.

**Example Connection (JavaScript):**
```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/user123');

ws.onopen = () => {
    console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};
```

### 2. Trip Collaboration
```
ws://localhost:8000/api/v1/ws/trip/{trip_id}?user_id={user_id}
```
Dedicated WebSocket for real-time trip collaboration.

**Example:**
```javascript
const tripWs = new WebSocket('ws://localhost:8000/api/v1/ws/trip/trip123?user_id=user456');
```

### 3. WebSocket Statistics
```
GET http://localhost:8000/api/v1/ws/stats
```
REST endpoint to get real-time connection statistics.

## Message Types

### Client → Server Messages

#### Join Trip Room
```json
{
    "type": "join_trip",
    "trip_id": "trip123"
}
```

#### Leave Trip Room
```json
{
    "type": "leave_trip",
    "trip_id": "trip123"
}
```

#### Trip Update
```json
{
    "type": "trip_update",
    "trip_id": "trip123",
    "data": {
        "title": "Updated Trip Title",
        "destination": "Paris"
    }
}
```

#### Itinerary Update
```json
{
    "type": "itinerary_update",
    "trip_id": "trip123",
    "data": {
        "day": 1,
        "activity": "Visit Eiffel Tower",
        "time": "10:00 AM"
    }
}
```

#### Budget Update
```json
{
    "type": "budget_update",
    "trip_id": "trip123",
    "data": {
        "category": "accommodation",
        "amount": 150.00
    }
}
```

#### Activity Update
```json
{
    "type": "activity_update",
    "trip_id": "trip123",
    "data": {
        "activity_id": "act456",
        "name": "Museum Visit"
    }
}
```

#### Typing Indicator
```json
{
    "type": "typing",
    "trip_id": "trip123",
    "field": "itinerary_day1"
}
```

#### Heartbeat/Ping
```json
{
    "type": "ping",
    "timestamp": "2026-01-03T12:00:00Z"
}
```

### Server → Client Messages

#### Connection Established
```json
{
    "type": "connection",
    "status": "connected",
    "user_id": "user123",
    "message": "WebSocket connection established",
    "timestamp": "2026-01-03T12:00:00Z"
}
```

#### User Joined Trip
```json
{
    "type": "user_joined",
    "user_id": "user456",
    "trip_id": "trip123",
    "timestamp": "2026-01-03T12:05:00Z"
}
```

#### User Left Trip
```json
{
    "type": "user_left",
    "user_id": "user456",
    "trip_id": "trip123",
    "timestamp": "2026-01-03T12:10:00Z"
}
```

#### Trip Updated
```json
{
    "type": "trip_updated",
    "trip_id": "trip123",
    "data": {
        "title": "New Title"
    },
    "updated_by": "user456",
    "timestamp": "2026-01-03T12:15:00Z"
}
```

#### Itinerary Updated
```json
{
    "type": "itinerary_updated",
    "trip_id": "trip123",
    "data": {
        "day": 2,
        "activity": "Beach Day"
    },
    "updated_by": "user456",
    "timestamp": "2026-01-03T12:20:00Z"
}
```

## Frontend Integration Example

### React Hook for WebSocket
```javascript
import { useEffect, useState, useRef } from 'react';

export const useWebSocket = (userId) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:8000/api/v1/ws/${userId}`);
        
        ws.current.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
        };
        
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };
        
        ws.current.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
        };
        
        return () => {
            ws.current?.close();
        };
    }, [userId]);

    const sendMessage = (message) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    };

    const joinTrip = (tripId) => {
        sendMessage({ type: 'join_trip', trip_id: tripId });
    };

    const leaveTrip = (tripId) => {
        sendMessage({ type: 'leave_trip', trip_id: tripId });
    };

    return { messages, isConnected, sendMessage, joinTrip, leaveTrip };
};
```

### Usage in Component
```javascript
function TripCollaboration({ userId, tripId }) {
    const { messages, isConnected, joinTrip, sendMessage } = useWebSocket(userId);

    useEffect(() => {
        if (isConnected) {
            joinTrip(tripId);
        }
    }, [isConnected, tripId]);

    const handleTripUpdate = (newData) => {
        sendMessage({
            type: 'trip_update',
            trip_id: tripId,
            data: newData
        });
    };

    return (
        <div>
            {isConnected ? '🟢 Live' : '🔴 Offline'}
            {/* Your UI here */}
        </div>
    );
}
```

## Testing WebSocket

### Using wscat (CLI Tool)
```bash
# Install wscat
npm install -g wscat

# Connect to user endpoint
wscat -c ws://localhost:8000/api/v1/ws/user123

# Send message
> {"type": "join_trip", "trip_id": "trip456"}
```

### Using Browser DevTools
```javascript
// Open browser console
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/testuser');

ws.onmessage = (e) => console.log(JSON.parse(e.data));

// Join a trip
ws.send(JSON.stringify({
    type: 'join_trip',
    trip_id: 'trip123'
}));

// Send a trip update
ws.send(JSON.stringify({
    type: 'trip_update',
    trip_id: 'trip123',
    data: { title: 'New Trip Title' }
}));
```

## Connection Management

### Automatic Reconnection (Recommended)
```javascript
class ReconnectingWebSocket {
    constructor(url, maxRetries = 5) {
        this.url = url;
        this.maxRetries = maxRetries;
        this.retries = 0;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
            console.log('Connected');
            this.retries = 0;
        };
        
        this.ws.onclose = () => {
            if (this.retries < this.maxRetries) {
                this.retries++;
                console.log(`Reconnecting... (${this.retries}/${this.maxRetries})`);
                setTimeout(() => this.connect(), 2000 * this.retries);
            }
        };
    }

    send(data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}
```

## Best Practices

1. **Always handle disconnections** - Implement reconnection logic
2. **Send periodic pings** - Keep connection alive with heartbeat messages
3. **Validate messages** - Check message types and required fields
4. **Handle errors gracefully** - Don't crash on malformed messages
5. **Clean up on unmount** - Close WebSocket connections when component unmounts
6. **Use room-based broadcasts** - Join specific trip rooms for targeted updates
7. **Implement typing indicators** - Improve UX for collaborative editing
8. **Show connection status** - Display live/offline indicator to users

## Performance Considerations

- **Connection pooling**: Manager handles multiple connections per user
- **Room-based routing**: Messages only broadcast to relevant users
- **Automatic cleanup**: Disconnected sockets removed automatically
- **Message batching**: Consider batching rapid updates on client side
- **Throttling**: Implement rate limiting for high-frequency updates

## Security

- [ ] TODO: Add JWT authentication for WebSocket connections
- [ ] TODO: Validate user permissions before broadcasting updates
- [ ] TODO: Implement rate limiting per connection
- [ ] TODO: Add message validation and sanitization

## Monitoring

Check active connections and rooms:
```bash
curl http://localhost:8000/api/v1/ws/stats
```

Response:
```json
{
    "active_users": 15,
    "active_rooms": 3,
    "rooms": {
        "trip_123": 5,
        "trip_456": 8,
        "trip_789": 2
    }
}
```

---

**Implementation by:** Sachin (SachinSv07)  
**Date:** January 3, 2026  
**Feature:** Real-time WebSocket data streaming for collaborative trip planning
