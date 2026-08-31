# Task Board (SyncBoard)

A role-based task management system with a Kanban workflow (To Do / Doing / Done),
manager and employee roles, and task assignment. Built with React (Vite) on the
front end and a Node.js/Express REST API on the back end.

## Project Structure

```
Task-Manager-dev/
├── taskboard/          # React front end (Vite)
│   └── src/
│       ├── api/        # fetch wrappers that call the backend
│       ├── components/ # TaskCard, TaskForm
│       ├── pages/       # Login, Register, Menu, Todo, Doing, Done, Profile, Employees
│       └── App.jsx      # top-level state + routing between pages
└── server/              # Express REST API (mock data for now, MongoDB in M3)
    └── src/
        ├── data/        # in-memory mock "database" (users, tasks)
        ├── controllers/ # request handlers
        ├── routes/       # route definitions, mounted in app.js
        ├── middleware/   # JWT auth
        ├── app.js        # express app setup
        └── server.js     # entry point
```

## How to Run

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev        # or: npm start
```
Runs on **http://localhost:5000**. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd taskboard
npm install
npm run dev
```
Runs on **http://localhost:5173** and calls the API at the URL set in `taskboard/.env`
(`VITE_API_URL=http://localhost:5000/api`).

### Test logins (seeded mock users)

| Email | Password | Role |
|---|---|---|
| isuru@gmail.com | isuru1234 | manager |
| nadith@gmail.com | nadith1234 | employee |
| sahan@gmail.com | sahan1234 | employee |
| manuja@gmail.com | manuja1234 | employee |

## API Contract

Base URL: `/api`. All routes except `/auth/*` and `/health` require
`Authorization: Bearer <token>` (returned from login/register).

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | – | Log in, returns `{ token, user }` |
| POST | `/auth/register` | – | Register a new employee, returns `{ token, user }` |
| GET | `/users?role=employee` | ✅ | List users, optional role filter |
| PUT | `/users/:email` | ✅ (self or manager) | Update a profile |
| GET | `/tasks?status=todo` | ✅ | List tasks, optional status filter |
| POST | `/tasks` | ✅ manager only | Create a task |
| PATCH | `/tasks/:id/move` | ✅ (assignee only) | Move a task, body `{ toStatus }` |
| DELETE | `/tasks/:id` | ✅ | Delete a task |

Full request/response examples: `server/TaskBoard.postman_collection.json`
(import into Postman — set the `token` collection variable after calling Login).

## Known Limitations (M2)

- Data lives in an in-memory array on the server (`server/src/data/`) — it resets
  whenever the server restarts. This gets replaced with MongoDB + Mongoose in M3.
- Auth uses a simple JWT signed with a shared secret; no password hashing yet.
