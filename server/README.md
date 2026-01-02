# Habit Tracker Backend

REST API for the Habit Tracker app backed by MongoDB for persistent storage.

## Features

- ✅ JWT authentication (signup/login)
- ✅ Full CRUD for habits
- ✅ Toggle habit completion by date
- ✅ MongoDB persistence with Mongoose models
- ✅ CORS enabled for frontend

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and set:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/habit_tracker
JWT_SECRET=your_dev_secret_change_in_production
```

### 3. Run the Server

```bash
npm run dev     # with Nodemon
# or
npm start       # plain Node
```

Server runs on **http://localhost:4000** by default. Use `/health` to verify the MongoDB connection.

## Environment Variables

Copy `.env.example` to `.env` and customize:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/habit_tracker
JWT_SECRET=your_secret # CHANGE IN PRODUCTION!
```

## API Endpoints

### Authentication

#### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "abc123",
    "email": "user@example.com"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@me.com",
  "password": "password123"
}
```

**Response (200):** Same as signup

### Habits (All require Authorization header)

#### Get All Habits
```bash
GET /api/habits
Authorization: Bearer <your_token>
```

**Response (200):**
```json
[
  {
    "id": "h1",
    "userId": "u1",
    "title": "Morning Exercise",
    "description": "30 minutes of cardio",
    "frequency": "daily",
    "startDate": "2025-11-01",
    "completedDates": ["2025-11-18", "2025-11-19"]
  }
]
```

#### Create Habit
```bash
POST /api/habits
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Meditation",
  "description": "10 minutes daily",
  "frequency": "daily",
  "startDate": "2025-11-20"
}
```

**Response (201):** Created habit object

#### Update Habit
```bash
PUT /api/habits/:id
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "New description"
}
```

**Response (200):** Updated habit object

#### Delete Habit
```bash
DELETE /api/habits/:id
Authorization: Bearer <your_token>
```

**Response (200):**
```json
{ "message": "Habit deleted successfully" }
```

#### Toggle Completion
```bash
POST /api/habits/:id/toggle
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "date": "2025-11-20"  # Optional, defaults to today
}
```

**Response (200):** Updated habit with modified completedDates

## Testing with cURL

Save this as `test-api.sh`:

```bash
#!/bin/bash
API="http://localhost:4000/api"

echo "🔐 Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@me.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "✅ Token received"
echo ""

echo "📋 Getting habits..."
curl -s "$API/habits" -H "Authorization: Bearer $TOKEN"
echo ""

echo "✅ Toggling habit..."
curl -s -X POST "$API/habits/h1/toggle" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-11-20"}'
```

Then run: `bash test-api.sh`

## Project Structure

```
server/
├── package.json        # Dependencies and scripts
├── index.js            # Express app setup
├── api.js              # Route handlers (auth + habits)
├── db.js               # MongoDB data access layer
├── middleware.js       # JWT verification
├── utils.js            # Helper functions
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Security Notes

⚠️ **IMPORTANT for production:**
1. Change `JWT_SECRET` to a strong random value
2. Use HTTPS only
3. Set `NODE_ENV=production`
4. Add rate limiting
5. Use environment variables for all secrets

## Troubleshooting

**Port already in use:**
```bash
PORT=5000 npm start
```

**MongoDB connection issues:**
- Ensure `mongod` is running locally or update `MONGODB_URI`
- Check network/VPC rules if using a hosted cluster

## License

ISC
```

---

## Setup Instructions

1. Create a folder named `server`
2. Copy each code section above into its corresponding file
3. Run `npm install`
4. Run `npm run dev` to start in mock mode
5. Test with: `curl http://localhost:4000/health`