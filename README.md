# JharVista-AI

A production-ready MERN stack web application designed to promote eco-tourism, cultural heritage, and travel experiences across Jharkhand through a modern digital platform.

![Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

* Modern and responsive UI with glassmorphism design
* Explore popular tourist destinations across Jharkhand
* Discover hidden gems and local attractions
* Smart travel planning experience
* Tourist, Explorer, and Admin user roles
* Explorer portal for submitting destinations and travel content
* Admin dashboard for content management and analytics
* Cloudinary integration for image uploads
* MongoDB-powered data management
* Mobile-friendly responsive interface

## Tech Stack

| Layer      | Technologies                                                  |
| ---------- | ------------------------------------------------------------- |
| Frontend   | React, Vite, Tailwind CSS, React Router, Axios, Framer Motion |
| Backend    | Node.js, Express.js                                           |
| Database   | MongoDB Atlas                                                 |
| Storage    | Cloudinary                                                    |
| Deployment | Vercel / Render (Optional)                                    |

---

## Project Structure

```text
JharVista-AI/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   └── server.js
│
└── README.md
```

## Installation

### Prerequisites

* Node.js 18+
* MongoDB Atlas or Local MongoDB
* Cloudinary Account (Optional)

### Clone Repository

```bash
git clone https://github.com/chetnnn18/JharVista-AI.git
cd JharVista-AI
```

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd ../client
npm install
```

---

## Environment Variables

### Server (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend:
http://localhost:5173

Backend:
http://localhost:5000

---

## User Roles

### Tourist

* Browse destinations
* View travel information
* Explore attractions

### Explorer

* Submit hidden destinations
* Share travel content
* Contribute community discoveries

### Admin

* Manage platform content
* Review submissions
* Monitor platform activity

---

## Future Enhancements

* Interactive maps integration
* Hotel and transport recommendations
* Event discovery system
* Personalized travel itineraries
* Multi-language support

---

## License

MIT License

Built with ❤️ for promoting tourism and cultural heritage across Jharkhand.
