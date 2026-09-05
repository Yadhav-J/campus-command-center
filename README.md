# Campus Command Center

Campus Command Center is a personal academic productivity dashboard. It brings together tasks, subjects, study sessions, assignments, exams, projects, coding progress, notes, schedules, and settings in one browser application.

The project is a small full-stack application:

- The `frontend/` folder contains the user interface and browser-side behavior.
- The `backend/` folder contains the Node.js HTTP server and API.
- SQLite stores users, sessions, and each user's dashboard data.

## Features

- Dashboard with task, project, assignment, coding streak, progress, schedule, and exam summaries.
- Subject management.
- Task tracking with completion and deletion.
- Study session planning with priorities and progress.
- Assignment tracking with status changes and progress statistics.
- Exam countdowns.
- Project tracking with technology, GitHub URL, deadline, status, and progress.
- Coding language and streak tracking.
- Notes with editing and deletion.
- Display name and light/dark theme settings.
- Multiple student accounts with isolated data.
- Registration, login, session persistence, and sign out.

## Requirements

- Windows, macOS, or Linux.
- Node.js 22.5 or newer. The server uses Node's built-in `node:sqlite` module, so Node 24 LTS or newer is recommended.
- A modern browser such as Chrome or Edge.

Check the installed Node version:

```powershell
node --version
```

## Project Structure

```text
campus command center/
|-- backend/
|   `-- server.js              Node HTTP server, API, authentication, SQLite setup
|-- frontend/
|   |-- index.html              Application markup and login screen
|   |-- script.js               Navigation, UI behavior, API synchronization
|   `-- style.css               Application styles and responsive layout
|-- campus-command-center.sqlite SQLite database created at runtime
|-- package.json                Start and development scripts
|-- package-lock.json           npm lockfile
|-- .gitignore                  Ignores dependencies, database, and SQLite journal files
`-- README.md                   Project documentation
```

The SQLite database is intentionally ignored by Git. It contains private account and dashboard data and should not be committed.

## Installation and Startup

From the project root:

```powershell
npm.cmd install
npm.cmd start
```

Open the application in Chrome:

```text
http://localhost:5501/
```

Keep the terminal running while using the application. Stop the server with `Ctrl+C`.

The development command uses Node's built-in file watcher:

```powershell
npm.cmd run dev
```

On macOS or Linux, the equivalent commands are usually:

```bash
npm install
npm start
```

## First Use

1. Open `http://localhost:5501/`.
2. Select **Create an account**.
3. Enter a name, email address, and password with at least eight characters.
4. Create the account.
5. Add tasks, subjects, assignments, exams, projects, notes, and other academic data.
6. Refresh the page to verify that the data persists.
7. Use **Sign out** when changing accounts.

## Architecture

The server uses only Node.js built-in modules:

- `node:http` serves the frontend and handles API requests.
- `node:sqlite` creates and queries the SQLite database.
- `node:crypto` hashes passwords and creates session tokens.
- `node:fs` serves frontend files.

The frontend uses standard HTML, CSS, and JavaScript. It keeps a local browser copy for offline fallback, while the API synchronizes data to the authenticated user's SQLite records when the application is served through the Node server.

The normal request flow is:

```text
Chrome -> frontend/ -> /api/auth/* or /api/data/* -> backend/server.js -> SQLite
```

## Authentication

### Registration

`POST /api/auth/register` creates an account and signs the user in immediately.

Request body:

```json
{
	"name": "Student Name",
	"email": "student@example.com",
	"password": "at-least-8-characters"
}
```

### Login

`POST /api/auth/login` verifies the email and password, then creates a seven-day session cookie.

```json
{
	"email": "student@example.com",
	"password": "at-least-8-characters"
}
```

Passwords are never stored as plain text. Each password receives a random salt and is hashed with Node's `crypto.scrypt` function.

### Current user

`GET /api/auth/me` returns the current user when the session cookie is valid. It returns `401` when there is no valid session.

### Logout

`POST /api/auth/logout` or `GET /api/auth/logout` removes the session and expires the browser cookie. The frontend uses the logout route as a browser navigation so Chrome reliably applies the expired cookie before returning to the login screen.

## Data API

All data routes require a valid session. Data is isolated using the authenticated user's ID, so two accounts can use the same data key without seeing each other's values.

### Health check

```text
GET /api/health
```

Example response:

```json
{
	"status": "ok",
	"database": "sqlite",
	"authentication": "enabled"
}
```

### Read a collection

```text
GET /api/data/campusTasks
```

Response:

```json
{
	"key": "campusTasks",
	"value": []
}
```

### Save a collection

```text
PUT /api/data/campusTasks
Content-Type: application/json
```

Request body:

```json
[
	{
		"text": "Review lecture notes",
		"completed": false
	}
]
```

The save endpoint returns `204 No Content`.

### Delete a collection

```text
DELETE /api/data/campusTasks
```

The delete endpoint also returns `204 No Content`.

### Frontend data keys

The browser uses these keys when synchronizing dashboard data:

| Key | Purpose |
| --- | --- |
| `campusSchedule` | Daily activities and class schedule |
| `campusTasks` | Tasks and completion status |
| `campusStudy` | Study sessions and priorities |
| `campusExams` | Exams and countdown dates |
| `campusAssignments` | Assignments, deadlines, priorities, and statuses |
| `campusProjects` | Projects, technologies, links, deadlines, and progress |
| `campusCoding` | Coding languages, progress, and streak |
| `campusSubjects` | Subjects and subject codes |
| `campusNotes` | Study notes |
| `campusSettings` | Display name and theme |

## Database

The database file is created automatically at the project root when the server starts:

```text
campus-command-center.sqlite
```

The server creates these tables:

- `users`: account name, email, password hash, password salt, and creation time.
- `sessions`: user relationship through a random session token and expiry timestamp.
- `user_data`: JSON values keyed by `(user_id, key)`.

The `user_data.value` column stores complete dashboard collections as JSON. This keeps the current frontend data model simple while still providing server persistence and account isolation.

### Backup

Stop the server before copying the SQLite file to reduce the chance of capturing an incomplete write:

```powershell
Copy-Item "campus-command-center.sqlite" "campus-command-center.backup.sqlite"
```

Do not upload the database to GitHub. It may contain private student information.

## Validation and Testing

Syntax checks:

```powershell
node --check backend/server.js
node --check frontend/script.js
```

Health check from PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:5501/api/health"
```

Manual application test:

1. Create two different accounts.
2. Add a task while signed in as the first account.
3. Sign out and sign in as the second account.
4. Confirm the second account cannot see the first account's task.
5. Refresh the page and confirm the first account's data persists when you sign back in.

The authentication and data-isolation flow was verified with two separate sessions. The project does not currently include an automated test runner.

## Problems Encountered and Solutions

### 1. Chrome reported `ERR_FILE_NOT_FOUND`

Opening a local HTML file directly or using an old file path caused Chrome to look for a file that was no longer at that location.

Solution: serve the project through the Node server and open:

```text
http://localhost:5501/
```

The app should not be started by opening an old `file:///...` path.

### 2. PowerShell blocked `npm.ps1`

On Windows, PowerShell may block the npm PowerShell shim with an execution-policy error.

Solution: use the Windows command executable:

```powershell
npm.cmd install
npm.cmd start
```

Changing the machine execution policy is not required for this project.

### 3. Native SQLite dependency failed to build

The first backend approach used `better-sqlite3`. On the available Node 24 environment, no compatible prebuilt binary was available, so npm attempted a native compilation. That compilation required Visual Studio with the C++ workload, which was not installed.

Solution: remove the native dependency and use Node's built-in `node:sqlite` module. This avoids a C++ toolchain and keeps installation dependency-free.

### 4. Frontend data originally lived only in `localStorage`

The initial frontend worked in the browser but had no server persistence. Closing the browser or using another account could not provide proper account-level storage.

Solution: keep `localStorage` as an offline fallback while routing saved dashboard collections through the authenticated `/api/data/:key` endpoints.

### 5. Multiple users could have shared data

The original storage model used one global key per collection. That would allow records to be mixed between accounts if authentication were added without changing the database key.

Solution: store each value using the composite key `(user_id, key)` in the `user_data` table and require a valid session before every data operation.

### 6. Logout was unreliable after an asynchronous fetch

The first logout implementation sent a fetch request and immediately reloaded the page. In some browser automation and timing conditions, the reload could happen before Chrome applied the expired cookie.

Solution: logout now navigates through `/api/auth/logout`. The server expires the cookie and redirects back to `/`, allowing the browser to process the cookie response first.

### 7. Moving the frontend folder on Windows

Windows file systems are commonly case-insensitive, so renaming `Frontend` directly to `frontend` can be treated as no change.

Solution: move the folder through a temporary name, then move it to lowercase. The backend and npm scripts were updated to use the new paths.

### 8. Missing server records returned `404`

New accounts do not have saved values for every collection yet. The frontend treats a missing record as an empty/default collection, while the API correctly uses `404` to indicate that the requested key has not been saved.

## Troubleshooting

### Port 5501 is already in use

Start the server on another port in PowerShell:

```powershell
$env:PORT=5502
npm.cmd start
```

Then open `http://localhost:5502/`.

### The page shows a login screen

This is expected when there is no valid session. Create an account or sign in. The session lasts seven days unless you sign out or the session is removed from the database.

### The API returns `401 Authentication required`

The request does not include a valid session cookie. Open the app through the browser, sign in, and retry the request. Data endpoints are intentionally protected.

### The app shows old browser data

Sign out and sign in again. The frontend clears its local account cache when switching accounts. Use the Settings page's clear-data action to remove the current user's saved collections from both the browser and SQLite.

### The app will not start after changing Node versions

Confirm that the installed Node version supports `node:sqlite`:

```powershell
node --version
node -e "const { DatabaseSync } = require('node:sqlite'); console.log('SQLite available')"
```

Use Node 22.5 or newer if the module is unavailable.

## Current Limitations Before Production Deployment

This project is suitable for local development and learning. Before deploying it publicly, add:

- HTTPS and secure-cookie behavior for production.
- Rate limiting for login and registration endpoints.
- CSRF protection for state-changing requests.
- Stronger email validation and account recovery.
- Session cleanup for expired sessions.
- Database migrations instead of only startup table creation.
- Automated unit and integration tests.
- Structured request logging and error monitoring.
- A production deployment process and database backup strategy.
- Environment-based configuration for the port and security settings.

## Git Workflow

The project uses focused Conventional Commit names. Examples from the current history:

```text
feat: add sqlite backend and authentication
feat: connect frontend to authenticated api
```

Before committing, validate the changed files and check the working tree:

```powershell
node --check backend/server.js
node --check frontend/script.js
git status
```
