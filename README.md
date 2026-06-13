# JharYatra AI

A production-ready MERN stack web application — a smart digital platform to promote eco & cultural tourism in Jharkhand.

![JharYatra AI](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- **Modern Gen-Z UI** — Glassmorphism, gradients, Framer Motion animations, dark mode
- **Homepage** — Hero collage, explore experiences, pride section, hidden gems, reels, AI trip planner, popular places, districts
- **AI Trip Planner** — Google Gemini API with intelligent fallback itineraries
- **User Roles** — Tourist, Explorer, Admin with protected routes
- **Explorer Features** — Submit hidden places & Instagram reels
- **Admin Dashboard** — Approve content, manage users, analytics
- **JWT Auth** — Secure registration & login
- **Cloudinary** — Image uploads for places & reels
- **Sample Seed Data** — Jharkhand tourism places, districts, reels

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, Framer Motion, React Icons |
| Backend | Node.js, Express.js, MongoDB Atlas, JWT, Multer, Cloudinary |
| AI | Google Gemini API |

## Project Structure

```
JharAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # UI, layout, home sections
│   │   ├── context/       # Auth & Theme
│   │   ├── pages/         # Route pages
│   │   └── routes/        # Protected routes
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # DB & Cloudinary
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/              # Sample Jharkhand data
│   └── server.js
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- (Optional) Cloudinary account for image uploads
- (Optional) Google Gemini API key for AI trip planning

### 1. Clone & Install

```bash
cd JharAI

# Backend
cd server
npm install
cp .env.example .env
# Edit .env with your credentials

# Frontend
cd ../client
npm install
cp .env.example .env
```

### 2. Configure Environment

**server/.env**

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/jharyatra
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd server
npm run seed
```

### 4. Run Development

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jharyatra.ai | admin123 |
| Explorer | explorer@jharyatra.ai | explorer123 |
| Tourist | tourist@jharyatra.ai | tourist123 |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/places` | List places |
| GET | `/api/places/:id` | Place details |
| POST | `/api/places` | Create place (explorer) |
| GET | `/api/districts` | List districts |
| GET | `/api/reels` | List reels |
| POST | `/api/reels` | Create reel (explorer) |
| POST | `/api/trips/generate-trip` | AI trip planner |
| POST | `/api/reviews` | Submit review |
| GET | `/api/users/stats` | Admin analytics |

## Color Palette

| Token | Hex |
|-------|-----|
| Primary | `#166534` |
| Secondary | `#22c55e` |
| Background | `#f8fafc` |
| Dark Section | `#0f172a` |
| Accent | `#f59e0b` |

## Production Build

```bash
# Frontend
cd client
npm run build

# Backend
cd server
NODE_ENV=production npm start
```

Serve `client/dist` via Nginx or Vercel/Netlify, and deploy the Express API to Render, Railway, or similar.

## License

MIT — Built with love for Jharkhand.
