const express = require("express");
const path = require("path");
const { getDatabase, getStats, DB_PATH } = require("./lib/db");
const { getCvData } = require("./lib/cv-service-sqlite");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/cv", (_req, res) => {
  try {
    const db = getDatabase();
    const data = getCvData(db);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/health", (_req, res) => {
  try {
    const db = getDatabase();
    const stats = getStats(db);
    res.json({
      ok: true,
      database: "SQLite",
      path: DB_PATH,
      ...stats,
      message:
        stats.persons > 0
          ? "SQLite-Datenbank bereit."
          : "Datenbank leer – Server neu starten.",
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  getDatabase();
  console.log(`Lebenslauf (SQLite): http://localhost:${PORT}`);
  console.log(`Datenbank-Datei: ${DB_PATH}`);
});
