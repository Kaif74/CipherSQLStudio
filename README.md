# CipherSQL Studio

A LeetCode-style SQL practice platform. Write and run SQL queries against a live PostgreSQL sandbox, get AI-powered hints, and track your progress across 20 problems.

Built with React, Node.js/Express, MongoDB, and PostgreSQL.


## Tech Stack

- **Frontend** — React + Vite, SCSS, Monaco Editor
- **Backend** — Node.js, Express
- **Databases** — MongoDB (users, assignments, attempts), PostgreSQL (SQL sandbox)
- **AI Hints** — Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (Atlas free tier works)
- A PostgreSQL instance (Neon free tier works)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

1. Clone the repo

```bash
git clone https://github.com/<your-username>/cipher-assignment.git
cd cipher-assignment
```

2. Backend

```bash
cd backend
cp .env.example .env
# Fill in your actual credentials in .env
npm install
npm run seed   # populates MongoDB with problems + PostgreSQL with tables
npm run dev
```

3. Frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

4. Open `http://localhost:5173`

### Environment Variables

Backend (`backend/.env`):

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Any random string for signing tokens |
| `GEMINI_API_KEY` | Google Gemini API key |

Frontend (`frontend/.env`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (default `http://localhost:5000/api`) |

## Deployment

Push the whole repo to GitHub, then deploy the two folders separately:

- **Frontend** → Vercel (set root directory to `frontend`, add `VITE_API_URL` env var)
- **Backend** → Render (set root directory to `backend`, add all env vars from `.env.example`)

## Project Structure

```
cipher-assignment/
├── frontend/           # React + Vite
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth & Theme providers
│   │   ├── pages/      # AssignmentList, AssignmentAttempt
│   │   ├── services/   # API calls (Axios)
│   │   └── styles/     # SCSS variables, mixins
│   └── ...
├── backend/            # Express API
│   ├── src/
│   │   ├── config/     # DB connections
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/  # Auth middleware
│   │   ├── models/     # Mongoose schemas
│   │   └── routes/     # API routes
│   ├── scripts/        # Database seed script
│   └── ...
└── README.md
```
