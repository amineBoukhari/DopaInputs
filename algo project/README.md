# Student Productivity App

Minimal full‑stack app combining Calendar, To‑Do List, Habit Tracker and Pomodoro.

## Quick summary
- Frontend: React
- Backend: Node + Express + Sequelize (SQLite)
- Port defaults: frontend 3000, backend 5000

---

## Prerequisites
- Node.js 16+ and npm
- Git
- (Optional) make sure ports 3000 and 5000 are free

---

## Repository setup

1. Clone
```bash
git clone <repo-url>
cd "algo project"
```

2. Install dependencies for both server and client
```bash
# from repo root
npm run install-all
```
If `install-all` is not available:
```bash
cd server && npm install
cd ../client && npm install
```

---

## Environment variables

Create `.env` files:

- Server: `/server/.env`
```env
# server/.env (example)
PORT=5000
# For SQLite the project uses a local file by default; you can set:
DATABASE_URL=sqlite:./database.sqlite
# Simple JWT secret for dev
JWT_SECRET=devsecret
# Client origin for CORS
CLIENT_URL=http://localhost:3000
```

- Client: `/client/.env` (optional)
```env
# client/.env (example)
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Run in development

From repo root:

- Start both (if script exists)
```bash
npm run dev
```

- Or run separately:

Backend:
```bash
cd server
npm run dev       # or: node index.js
```

Frontend:
```bash
cd client
npm start
```

Open: http://localhost:3000

---

## Database & migrations

- This project uses Sequelize with automatic sync in development.
- The DB file (SQLite) will be created at `server/database.sqlite` (or as set in `DATABASE_URL`).
- To reset DB in dev: stop server, delete `server/database.sqlite`, then start server again to recreate.

If you add migrations, use Sequelize CLI (not included by default).

---

## Common tasks

- Build frontend for production:
```bash
cd client
npm run build
```

- Start production backend:
```bash
cd server
NODE_ENV=production node index.js
```

- Run tests (if present):
```bash
# Example, adjust if project has tests
cd client && npm test
cd server && npm test
```

---

## Troubleshooting

- Logo missing: ensure `client/public/bg.png` exists.
- CORS errors: verify `CLIENT_URL` in server `.env`.
- Port conflicts: change `PORT` in server `.env` or run client at different port (React will prompt).

---

## Notes & next steps

- For production, replace `JWT_SECRET`, consider using a managed DB, add migrations, and secure CORS.
- To enable notifications/WhatsApp or external APIs, add provider credentials to server `.env` and secure them.

---

If you want, I can:
- add an `.env.example` file,
- create npm scripts for resetting DB,
- or produce a small checklist to prepare a production deployment.