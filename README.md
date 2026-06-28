# GemSpot 🗺️

> Discover places the algorithm never shows you.

A full-stack community web app where real people share hidden cafés,
rooftops, bookshops, and secret spots in their city.
No ads. No paid listings. Just real places.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6+ |
| Map | Leaflet.js |
| Backend | Node.js, Express.js |
| Auth | JWT + Bcrypt |
| Database | MongoDB |

## Features

- Interactive live gem map with custom pins
- Filter spots by category and mood
- Community upvoting — one vote per user per spot
- Scout badge and leaderboard system
- Full user authentication (register, login, logout)
- Submit hidden spots with map pin location
- User profile with gem history and badges

## Setup

### Prerequisites
- Node.js v18+
- MongoDB installed locally
- VS Code + Live Server extension

### Installation

1. Clone the repo
   git clone https://github.com/ShaistaAmeen/gemspot.git

2. Install backend dependencies
   cd gemspot/backend
   npm install

3. Create .env file inside backend folder
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gemspot
   JWT_SECRET=your_secret_key_here

4. Start the backend server
   npm run dev

5. Open frontend/index.html with Live Server

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create new account |
| POST | /api/auth/login | Login to account |
| GET | /api/spots | Get all spots |
| POST | /api/spots | Submit new spot |
| PUT | /api/spots/:id/vote | Upvote a spot |
| DELETE | /api/spots/:id | Delete a spot |

## Author

**Shaista Ameen**
BS Computer Science — Islamia University of Bahawalpur