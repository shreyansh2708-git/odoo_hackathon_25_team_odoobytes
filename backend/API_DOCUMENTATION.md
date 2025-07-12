# Skill Swap Platform API Documentation

## Base URL
`http://localhost:5000/api`


## Authentication
All protected routes require a JWT token in the Authorization header:
`Authorization: Bearer <your_jwt_token>`


## API Endpoints

### 🔐 Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York" // optional
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Password
```http
PUT /api/auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### 👥 User Routes (`/api/users`)

#### Get All Users (with search)
```http
GET /api/users?search=photoshop&skill=javascript&location=london&page=1&limit=10
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/USER_ID
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "location": "London",
  "bio": "I love sharing knowledge",
  "isPublic": true,
  "skillsOffered": [
    {
      "name": "JavaScript",
      "description": "Frontend development",
      "level": "advanced",
      "category": "Technology"
    }
  ],
  "skillsWanted": [
    {
      "name": "Photoshop",
      "description": "Photo editing",
      "level": "beginner",
      "category": "Design"
    }
  ],
  "availability": ["weekends", "evenings"]
}
```

#### Upload Profile Photo
```http
POST /api/users/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

profilePhoto: <image_file>
```

#### Get My Swap History
```http
GET /api/users/me/swaps?status=completed&page=1&limit=10
Authorization: Bearer <token>
```

#### Get My Ratings
```http
GET /api/users/me/ratings?page=1&limit=10
Authorization: Bearer <token>
```

#### Deactivate Account
```http
DELETE /api/users/me/deactivate
Authorization: Bearer <token>
```

### 🔄 Swap Routes (`/api/swaps`)

#### Create Swap Request
```http
POST /api/swaps
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "USER_ID",
  "skillOffered": {
    "name": "JavaScript",
    "description": "I can teach React basics",
    "level": "intermediate"
  },
  "skillRequested": {
    "name": "Photoshop",
    "description": "Need help with photo editing",
    "level": "beginner"
  },
  "message": "Hi! I'd love to swap skills with you.",
  "scheduledDate": "2024-01-15T14:00:00Z",
  "duration": 2,
  "meetingType": "online",
  "meetingDetails": "Google Meet link will be shared"
}
```

#### Get My Swap Requests
```http
GET /api/swaps/my?type=sent&status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Swap Request by ID
```http
GET /api/swaps/SWAP_ID
Authorization: Bearer <token>
```

#### Accept Swap Request
```http
PUT /api/swaps/SWAP_ID/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "responseMessage": "Great! Let's do this.",
  "scheduledDate": "2024-01-15T14:00:00Z",
  "meetingDetails": "Zoom link: https://zoom.us/j/123456789"
}
```

#### Reject Swap Request
```http
PUT /api/swaps/SWAP_ID/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "responseMessage": "Sorry, I'm not available right now."
}
```

#### Cancel Swap Request
```http
PUT /api/swaps/SWAP_ID/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "cancelReason": "Schedule conflict"
}
```

#### Complete Swap
```http
PUT /api/swaps/SWAP_ID/complete
Authorization: Bearer <token>
```

#### Rate Swap Partner
```http
POST /api/swaps/SWAP_ID/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great teacher! Very patient and helpful.",
  "skillRating": {
    "quality": 5,
    "communication": 5,
    "punctuality": 4,
    "helpfulness": 5
  },
  "wouldRecommend": true
}
```

### 🔧 Admin Routes (`/api/admin`)

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get All Users (Admin)
```http
GET /api/admin/users?search=john&status=active&page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Toggle User Status
```http
PUT /api/admin/users/USER_ID/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "isActive": false,
  "reason": "Violation of terms"
}
```

#### Get All Swap Requests (Admin)
```http
GET /api/admin/swaps?status=pending&page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Get All Ratings (Admin)
```http
GET /api/admin/ratings?flagged=true&page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Flag/Unflag Rating
```http
PUT /api/admin/ratings/RATING_ID/flag
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "flagged": true,
  "flagReason": "Inappropriate content"
}
```

#### Get Activity Reports
```http
GET /api/admin/reports?startDate=2024-01-01&endDate=2024-01-31&type=swaps
Authorization: Bearer <admin_token>
```

#### Send Platform Message
```http
POST /api/admin/message
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Platform Maintenance",
  "message": "We'll be performing maintenance on Sunday.",
  "type": "info"
}
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error