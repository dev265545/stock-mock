import bcrypt from "bcrypt";
import { useEffect } from "react";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { v4 } from "uuid";
export default async function handler(req, res) {
  const { username, password } = req.body;

  // Connect to the SQLite database
  const db = await open({
    filename: "./data/database.db",
    driver: sqlite3.Database,
  });

  try {
    // Fetch the user from the database
    const user = await db.get(
      "SELECT * FROM users WHERE username = ?",
      username
    );

    if (!user) {
      // User not found
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Incorrect password
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // User authentication successful
    // You can generate a JWT token here and send it as a response if needed
   

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
