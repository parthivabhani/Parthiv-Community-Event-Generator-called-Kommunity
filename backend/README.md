Community Event Planner
Overview
Simple fullstack app to plan and view community events. Backend: Express + MongoDB. Frontend: React + Vite.
Run locally
1.	Start MongoDB (local or Atlas).
2.	Backend
⦁	cd backend
⦁	create .env file (see example)
⦁	npm install
⦁	npm run dev
3.	Frontend
⦁	cd frontend
⦁	npm install
⦁	npm run dev
Endpoints
⦁	POST /api/auth/signup
⦁	POST /api/auth/login
⦁	GET /api/events
⦁	POST /api/events (protected)
Notes
⦁	JWT stored in localStorage.