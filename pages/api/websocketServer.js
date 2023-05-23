import { createServer } from "http";
import { Server } from "ws";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize SQLite database
async function initializeDatabase() {
  const db = await open({
    filename: "./data.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT,
      price REAL,
      timestamp INTEGER
    )
  `);

  return db;
}

// Start WebSocket server
function startWebSocketServer(db) {
  const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running.");
  });

  const wss = new Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connected");

    // Send price data to connected clients every 1 second
    const interval = setInterval(async () => {
      const rows = await db.all(
        "SELECT * FROM prices ORDER BY id DESC LIMIT 10"
      );
      ws.send(JSON.stringify(rows));
    }, 1000);

    ws.on("close", () => {
      console.log("WebSocket disconnected");
      clearInterval(interval);
    });
  });

  server.listen(3000, () => {
    console.log("Server started on port 3000");
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await initializeDatabase();
    startWebSocketServer(db);
  } else {
    res.status(405).end();
  }
}
