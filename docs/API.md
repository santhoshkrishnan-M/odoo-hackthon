# GlobeTrotter API Documentation

## Overview

The GlobeTrotter API provides RESTful endpoints for managing travel trips, itineraries, budgets, and user accounts.

**Base URL**: `http://localhost:8000/api/v1`

**Interactive Documentation**: `http://localhost:8000/docs` (Swagger UI)

## Modules & Endpoints

### 🔐 Authentication (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### 👤 Users (`/users`)
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/{user_id}` - Get user by ID
- `DELETE /users/{user_id}` - Delete user account

### 🌍 Trips (`/trips`)
- `GET /trips` - List all user trips
- `POST /trips` - Create new trip
- `GET /trips/{trip_id}` - Get trip details
- `PUT /trips/{trip_id}` - Update trip
- `DELETE /trips/{trip_id}` - Delete trip

### 📋 Itinerary (`/itinerary`)
- `GET /trips/{trip_id}/itinerary` - Get trip itinerary
- `POST /trips/{trip_id}/itinerary` - Add itinerary item
- `PUT /itinerary/{item_id}` - Update itinerary item
- `DELETE /itinerary/{item_id}` - Delete itinerary item

### 💰 Budget (`/budget`)
- `GET /trips/{trip_id}/budget` - Get trip budget
- `POST /trips/{trip_id}/budget` - Add expense
- `PUT /budget/{expense_id}` - Update expense
- `DELETE /budget/{expense_id}` - Delete expense

### 🛠️ Admin (`/admin`)
- `GET /admin/users` - List all users
- `GET /admin/trips` - List all trips
- `GET /admin/stats` - Get system statistics

### 📌 Shared (`/shared`)
- `GET /health` - Health check endpoint

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": {}
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "detail": {}
}
```

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer <your_jwt_token>
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

**Note**: This is a skeleton API. Full endpoint details will be updated as features are implemented.
