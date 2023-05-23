import bcrypt from "bcrypt";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export default async function handler(req, res) {
  const { name, username, password } = req.body;
  console.log(req.body)

  // Connect to the SQLite database
  const db = await open({
    filename: "./data/database.db",
    driver: sqlite3.Database,
  });

  try {
    // Check if the username is already taken
    const existingUser = await db.get(
      "SELECT * FROM users WHERE username = ?",
      username
    );

    if (existingUser) {
      // Username already exists
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.run(
      "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
      [name, username, hashedPassword]
    );

    // Registration successful
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
