# Full-Stack Authentication App

A full-stack web application with role-based authentication (User/Admin) built with Next.js, Express, and MongoDB.

# AI used :
- Cursor 
- chatgpt

## Features

- ✅ Role-based signup and login (User/Admin)
- ✅ Secure password storage with bcrypt
- ✅ JWT-based authentication
- ✅ Protected dashboard route
- ✅ Role-specific dashboard display
- ✅ Modern UI with TailwindCSS

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Zod for validation

### Frontend
- Next.js 16 with TypeScript
- TailwindCSS for styling
- react-hook-form for form handling

## Project Structure

```
inbotiq/
├── backend/
│   ├── src/
│   │   ├── app.js           # Express app setup
│   │   ├── server.js        # Server entry point
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/           # Utility functions
│   │   └── validators/      # Zod schemas
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx         # Home page
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   └── dashboard/       # Protected dashboard
│   ├── components/          # React components
│   ├── lib/                 # API client & utilities
│   ├── .env.example
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier) or local MongoDB instance

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inbotiq
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:3000
```

4. Update the `.env` file with your MongoDB connection string and a secure JWT secret.

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (copy from `.env.example`):
```bash
BACKEND_API_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### POST `/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "admin"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### POST `/auth/login`
Authenticate and login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### GET `/auth/me`
Get current authenticated user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```


## Security Features

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 1 day
- Protected routes require valid authentication
- CORS configured for security
- Input validation with Zod schemas

