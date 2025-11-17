const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const DB_PATH = path.resolve(__dirname, "immobilien.db");
const INIT_SQL_PATH = path.resolve(__dirname, "db_init.sql");

const db = new sqlite3.Database(DB_PATH);

const initDb = () => {
  const schema = fs.readFileSync(INIT_SQL_PATH, "utf8");
  db.serialize(() => {
    db.exec(schema, (error) => {
      if (error) {
        console.error("Fehler beim Initialisieren der Datenbank:", error);
        process.exit(1);
      } else {
        console.log("SQLite-Datenbank bereit.");
      }
    });
  });
};

module.exports = { db, initDb };
