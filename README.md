# Campus Command Center

## Run the app

```powershell
npm install
npm start
```

Open http://localhost:5501/ in Chrome.

The project is organized into two main folders:

- `frontend/` contains the HTML, CSS, and browser JavaScript.
- `backend/` contains the Node.js server.

## Backend API

- `GET /api/health` checks the server and database.
- `GET /api/data/:key` reads a JSON value.
- `PUT /api/data/:key` saves a JSON value.
- `DELETE /api/data/:key` removes a value.

The SQLite database is created as `campus-command-center.sqlite` the first time the server starts.

## Accounts

Create an account from the login screen. Passwords are hashed before storage, sessions use HTTP-only cookies, and each account has isolated campus data. Use **Sign out** to end the current session.
