const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");
const { db, initDb } = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["*"];

initDb();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());

const propertyFields = [
  "title",
  "municipality",
  "size",
  "purchasePrice",
  "renovationCost",
  "additionalCosts",
  "expectedRent",
  "expectedSalePrice",
  "strategy",
  "status",
  "acquisitionDate",
  "holdingPeriodMonths",
];

const mapRow = (row) => ({
  id: row.id,
  title: row.title,
  municipality: row.municipality,
  size: row.size,
  purchasePrice: row.purchasePrice,
  renovationCost: row.renovationCost,
  additionalCosts: row.additionalCosts,
  expectedRent: row.expectedRent,
  expectedSalePrice: row.expectedSalePrice,
  strategy: row.strategy,
  status: row.status,
  acquisitionDate: row.acquisitionDate,
  holdingPeriodMonths: row.holdingPeriodMonths,
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/properties", (_, res) => {
  db.all("SELECT * FROM properties ORDER BY createdAt DESC", [], (error, rows) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Fehler beim Laden" });
    }
    return res.json(rows.map(mapRow));
  });
});

app.get("/properties/:id", (req, res) => {
  db.get("SELECT * FROM properties WHERE id = ?", [req.params.id], (error, row) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Fehler beim Laden" });
    }
    if (!row) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }
    return res.json(mapRow(row));
  });
});

app.post("/properties", (req, res) => {
  const missing = propertyFields.filter((field) => req.body[field] === undefined);
  if (missing.length) {
    return res.status(400).json({ message: `Fehlende Felder: ${missing.join(", ")}` });
  }
  const id = randomUUID();
  const placeholders = propertyFields.map(() => "?").join(", ");
  const query = `INSERT INTO properties (id, ${propertyFields.join(
    ", ",
  )}) VALUES (?, ${placeholders})`;
  const values = [id, ...propertyFields.map((field) => req.body[field])];

  db.run(query, values, function (error) {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Fehler beim Speichern" });
    }
    db.get("SELECT * FROM properties WHERE id = ?", [id], (selectErr, row) => {
      if (selectErr) {
        console.error(selectErr);
        return res.status(500).json({ message: "Fehler nach dem Speichern" });
      }
      return res.status(201).json(mapRow(row));
    });
  });
});

app.patch("/properties/:id", (req, res) => {
  const updates = propertyFields.filter((field) => req.body[field] !== undefined);
  if (!updates.length) {
    return res.status(400).json({ message: "Keine Felder zum Aktualisieren angegeben" });
  }
  const setClause = updates.map((field) => `${field} = ?`).join(", ");
  const query = `UPDATE properties SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
  const values = [...updates.map((field) => req.body[field]), req.params.id];
  db.run(query, values, function (error) {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Fehler beim Aktualisieren" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }
    db.get("SELECT * FROM properties WHERE id = ?", [req.params.id], (selectErr, row) => {
      if (selectErr) {
        console.error(selectErr);
        return res.status(500).json({ message: "Fehler nach dem Aktualisieren" });
      }
      return res.json(mapRow(row));
    });
  });
});

app.delete("/properties/:id", (req, res) => {
  db.run("DELETE FROM properties WHERE id = ?", [req.params.id], function (error) {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Fehler beim Löschen" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Nicht gefunden" });
    }
    return res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
