const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");
const fs = require("fs");

const database = new sqlite3.Database("./data/database.db");

// Create the historical_prices table
database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS historical_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instrument_name TEXT,
      date TEXT,
      price REAL
    )
  `);
  database.run(`
     CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
  `);


  // Import data from CSV file
  fs.createReadStream("historical_prices.csv")
    .pipe(csv())
    .on("data", (row) => {
      const { instrument_name, date, price } = row;
      database.run(
        `INSERT INTO historical_prices (instrument_name, date, price) VALUES (?, ?, ?)`,
        [instrument_name, date, parseFloat(price)]
      );
    })
    .on("end", () => {
      console.log("Data import complete");
    });
});

module.exports = database;
