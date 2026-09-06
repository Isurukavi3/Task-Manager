# Task Board (SyncBoard)

A role-based task management system with a Kanban workflow (**To Do → Doing → Done**), manager and employee roles, and task assignment. Built with React (Vite) on the front end and a Node.js/Express REST API on the back end, backed by MongoDB (Mongoose).

## Project Structure

```
Task-Manager-dev/
├── taskboard/          # React front end (Vite)
│   └── src/
│       ├── api/        # fetch wrappers that call the backend
│       ├── components/ # TaskCard, TaskForm
│       ├── db/         # PouchDB local store + offline sync logic
│       ├── pages/      # Login, Register, Menu, Todo, Doing, Done, Profile, Employees
│       └── App.jsx     # top-level state + routing between pages
└── server/              # Express REST API, MongoDB via Mongoose
    └── src/
        ├── data/        # repository layer (Mongoose queries) — used by controllers
        ├── models/       # Mongoose schemas (User, Task)
        ├── controllers/  # request handlers
        ├── routes/       # route definitions, mounted in app.js
        ├── middleware/   # JWT auth
        ├── db/           # Mongo connection setup
        ├── app.js        # express app setup
        └── server.js     # entry point
```

## How to Run

### 1. Backend

```bash
cd server
cp .env.example .env    # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev
```
Runs on **http://localhost:5050** (port 5000 is often taken by macOS AirPlay Receiver — set `PORT` in `.env` to change it). Health check: `GET /api/health`.

### 2. Frontend

```bash
cd taskboard
cp .env.example .env     # set VITE_API_URL=http://localhost:5050/api
npm install
npm run dev
```
Runs on **http://localhost:5173**.

Both servers need to be running at the same time, in separate terminals.

### Test logins (seeded users, in MongoDB Atlas)

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
| GET | `/tasks/stats` | ✅ | Aggregation: task counts per assignee, by status |
| POST | `/tasks` | ✅ manager only | Create a task |
| PATCH | `/tasks/:id/move` | ✅ (assignee only) | Move a task, body `{ toStatus, version }` |
| DELETE | `/tasks/:id` | ✅ | Delete a task |

Full request/response examples: `server/TaskBoard.postman_collection.json`.

## Data Persistence & Concurrency (Assignment 3)

### Data model
Two flat MongoDB collections — `users` and `tasks` — no embedding. Neither
document owns a bounded child list (a user isn't made of tasks, a task
isn't made of sub-items), so there's no natural parent/child shape to embed.
`assigneeEmail` is duplicated onto each task rather than only referenced,
because the board reads it on every render while usernames/emails change
rarely — a deliberate read-heavy, write-rare tradeoff.

### Indexes
- `users.email` — unique, used on every login/lookup.
- `tasks.{assigneeEmail, status}` — compound index supporting the "my
  tasks by status" queries the board makes constantly.
- `tasks.status` — supports the plain status filter on `/api/tasks`.

### Aggregation
`GET /api/tasks/stats` groups tasks by assignee and status, returning a
per-person breakdown with totals — used to show workload distribution.

### Optimistic concurrency
Each task carries a `version` field. Moving a task requires sending the
version last seen by the client; if it no longer matches the current DB
value (someone else moved it first), the server returns `409 Conflict`
with the current document instead of silently overwriting it.

### Offline client persistence
The React client stores tasks locally via PouchDB. On load, the UI reads
from local storage first (so it works with no network), then syncs with
the server in the background. Moves are applied locally first (instant,
works offline) and queued for replay once the server is reachable again.
If the server rejects a move with `409`, the task is flagged with the
conflict and the server's current state, and shown to the user instead
of being silently lost.

## Known Limitations

- Passwords are stored and compared in plain text — no hashing yet.
- The offline conflict banner clears on the next page visit/refresh
  rather than instantly, since it isn't wired to trigger a live re-render.