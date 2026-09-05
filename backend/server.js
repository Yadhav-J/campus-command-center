const fs = require("node:fs");
const crypto = require("node:crypto");
const http = require("node:http");
const path = require("node:path");
const { promisify } = require("node:util");
const { DatabaseSync } = require("node:sqlite");

const port = Number(process.env.PORT) || 5501;
const projectPath = path.join(__dirname, "..");
const databasePath = path.join(projectPath, "campus-command-center.sqlite");
const frontendPath = path.join(projectPath, "frontend");
const database = new DatabaseSync(databasePath);

database.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_data (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, key)
    )
`);

const scrypt = promisify(crypto.scrypt);
const findUserByEmail = database.prepare("SELECT * FROM users WHERE email = ?");
const findUserById = database.prepare("SELECT id, name, email FROM users WHERE id = ?");
const createUser = database.prepare(`
    INSERT INTO users (name, email, password_hash, password_salt)
    VALUES (?, ?, ?, ?)
`);
const createSession = database.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)");
const findSession = database.prepare(`
    SELECT sessions.token, sessions.user_id, sessions.expires_at, users.name, users.email
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ?
`);
const removeSession = database.prepare("DELETE FROM sessions WHERE token = ?");
const readData = database.prepare("SELECT value FROM user_data WHERE user_id = ? AND key = ?");
const writeData = database.prepare(`
    INSERT INTO user_data (user_id, key, value, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
`);
const deleteData = database.prepare("DELETE FROM user_data WHERE user_id = ? AND key = ?");

const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};

function sendJson(response, statusCode, value) {
    const body = JSON.stringify(value);
    response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    response.end(body);
}

function parseCookies(request) {
    const cookies = {};

    (request.headers.cookie || "").split(";").forEach(function(cookie) {
        const separator = cookie.indexOf("=");

        if (separator > -1) {
            const name = cookie.slice(0, separator).trim();
            cookies[name] = decodeURIComponent(cookie.slice(separator + 1).trim());
        }
    });

    return cookies;
}

function setSessionCookie(response, token) {
    response.setHeader("Set-Cookie", `session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`);
}

function clearSessionCookie(response) {
    response.setHeader("Set-Cookie", "session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

async function hashPassword(password, salt) {
    const passwordSalt = salt || crypto.randomBytes(16).toString("hex");
    const hash = await scrypt(password, passwordSalt, 64);
    return { hash: hash.toString("hex"), salt: passwordSalt };
}

async function getSession(request) {
    const token = parseCookies(request).session;

    if (!token) {
        return null;
    }

    const session = findSession.get(token);

    if (!session || session.expires_at <= Date.now()) {
        if (session) {
            removeSession.run(token);
        }

        return null;
    }

    return session;
}

function requireSession(session, response) {
    if (!session) {
        sendJson(response, 401, { error: "Authentication required" });
        return false;
    }

    return true;
}

function readRequestBody(request) {
    return new Promise(function(resolve, reject) {
        let body = "";

        request.on("data", function(chunk) {
            body += chunk;

            if (body.length > 1024 * 1024) {
                reject(new Error("Request body is too large"));
                request.destroy();
            }
        });

        request.on("end", function() {
            resolve(body);
        });

        request.on("error", reject);
    });
}

async function handleRequest(request, response) {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const dataMatch = requestUrl.pathname.match(/^\/api\/data\/([^/]+)$/);

    if (requestUrl.pathname === "/api/health" && request.method === "GET") {
        sendJson(response, 200, { status: "ok", database: "sqlite", authentication: "enabled" });
        return;
    }

    if (requestUrl.pathname === "/api/auth/register" && request.method === "POST") {
        try {
            const body = JSON.parse(await readRequestBody(request));
            const name = String(body.name || "").trim();
            const email = String(body.email || "").trim().toLowerCase();
            const password = String(body.password || "");

            if (!name || !email.includes("@") || password.length < 8) {
                sendJson(response, 400, { error: "Name, valid email, and an 8-character password are required" });
                return;
            }

            if (findUserByEmail.get(email)) {
                sendJson(response, 409, { error: "An account with that email already exists" });
                return;
            }

            const passwordData = await hashPassword(password);
            const result = createUser.run(name, email, passwordData.hash, passwordData.salt);
            const token = crypto.randomBytes(32).toString("hex");
            createSession.run(token, Number(result.lastInsertRowid), Date.now() + 7 * 24 * 60 * 60 * 1000);
            setSessionCookie(response, token);
            sendJson(response, 201, { user: findUserById.get(Number(result.lastInsertRowid)) });
        } catch (error) {
            sendJson(response, 400, { error: "A valid JSON body is required" });
        }
        return;
    }

    if (requestUrl.pathname === "/api/auth/login" && request.method === "POST") {
        try {
            const body = JSON.parse(await readRequestBody(request));
            const email = String(body.email || "").trim().toLowerCase();
            const password = String(body.password || "");
            const user = findUserByEmail.get(email);

            if (!user) {
                sendJson(response, 401, { error: "Invalid email or password" });
                return;
            }

            const passwordData = await hashPassword(password, user.password_salt);
            const matches = crypto.timingSafeEqual(
                Buffer.from(passwordData.hash, "hex"),
                Buffer.from(user.password_hash, "hex")
            );

            if (!matches) {
                sendJson(response, 401, { error: "Invalid email or password" });
                return;
            }

            const token = crypto.randomBytes(32).toString("hex");
            createSession.run(token, user.id, Date.now() + 7 * 24 * 60 * 60 * 1000);
            setSessionCookie(response, token);
            sendJson(response, 200, { user: findUserById.get(user.id) });
        } catch (error) {
            sendJson(response, 400, { error: "A valid JSON body is required" });
        }
        return;
    }

    if (requestUrl.pathname === "/api/auth/me" && request.method === "GET") {
        const session = await getSession(request);
        sendJson(response, session ? 200 : 401, session ? { user: findUserById.get(session.user_id) } : { error: "Not signed in" });
        return;
    }

    if (requestUrl.pathname === "/api/auth/logout" && (request.method === "POST" || request.method === "GET")) {
        const token = parseCookies(request).session;

        if (token) {
            removeSession.run(token);
        }

        clearSessionCookie(response);

        if (request.method === "GET") {
            response.writeHead(303, { Location: "/" });
            response.end();
            return;
        }

        response.writeHead(204);
        response.end();
        return;
    }

    if (dataMatch) {
        const session = await getSession(request);

        if (!requireSession(session, response)) {
            return;
        }

        const key = decodeURIComponent(dataMatch[1]);

        if (request.method === "GET") {
            const record = readData.get(session.user_id, key);

            if (!record) {
                sendJson(response, 404, { error: "Data not found" });
                return;
            }

            sendJson(response, 200, { key: key, value: JSON.parse(record.value) });
            return;
        }

        if (request.method === "PUT") {
            try {
                const body = await readRequestBody(request);
                writeData.run(session.user_id, key, JSON.stringify(JSON.parse(body)));
                response.writeHead(204);
                response.end();
            } catch (error) {
                sendJson(response, 400, { error: "A valid JSON body is required" });
            }
            return;
        }

        if (request.method === "DELETE") {
            deleteData.run(session.user_id, key);
            response.writeHead(204);
            response.end();
            return;
        }
    }

    if (request.method !== "GET" || requestUrl.pathname.startsWith("/api/")) {
        sendJson(response, 404, { error: "Route not found" });
        return;
    }

    const relativePath = requestUrl.pathname === "/" ? "index.html" : requestUrl.pathname.slice(1);
    const filePath = path.resolve(frontendPath, relativePath);

    if (!filePath.startsWith(frontendPath) || !fs.existsSync(filePath)) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("File not found");
        return;
    }

    response.writeHead(200, {
        "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(function(request, response) {
    handleRequest(request, response).catch(function() {
        sendJson(response, 500, { error: "Internal server error" });
    });
});

server.listen(port, function() {
    console.log(`Campus Command Center running at http://localhost:${port}`);
    console.log(`SQLite database: ${databasePath}`);
});
