import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default async function handler(req, res) {
  const { symbol, from_date, to_date } = req.query;

  try {
    const db = await open({
      filename: "./data/database.db",
      driver: sqlite3.Database,
    });

    const rows = await db.all(
      `SELECT * FROM historical_prices WHERE instrument_name = ? AND date >= datetime(?) AND date <= datetime(?)`,
      [symbol, from_date, to_date]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
