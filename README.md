# Full-Stack Authentication App

A full-stack web application with role-based authentication (User/Admin) built with Next.js, Express, and MongoDB.

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
NEXT_PUBLIC_API_URL=http://localhost:4000
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

## Deployment

### Backend Deployment (Render/Railway)

1. Push your code to GitHub
2. Connect your repository to Render or Railway
3. Set environment variables:
   - `PORT` (usually auto-set by platform)
   - `MONGODB_URI` (your MongoDB Atlas connection string)
   - `JWT_SECRET` (a secure random string)
   - `CORS_ORIGIN` (your frontend URL, e.g., `https://your-app.vercel.app`)

4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend Deployment (Vercel/Netlify)

#### Vercel
1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend URL, e.g., `https://your-backend.onrender.com`)
4. Deploy

#### Netlify
1. Push your code to GitHub
2. Import your repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Set environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend URL)

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `CORS_ORIGIN` - Allowed CORS origin(s), comma-separated

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Usage

1. Visit the home page at `http://localhost:3000`
2. Click "Sign up" to create an account
3. Select a role (User or Admin) during signup
4. After signup, you'll be redirected to the dashboard
5. The dashboard displays: "Welcome, [Name] (User)" or "Welcome, [Name] (Admin)"
6. You can logout and login again using your credentials

## Security Features

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 1 day
- Protected routes require valid authentication
- CORS configured for security
- Input validation with Zod schemas

## License

ISC

