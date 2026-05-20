const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "data.db");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS late_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher TEXT NOT NULL,
      class_name TEXT NOT NULL,
      date TEXT NOT NULL,
      lesson INTEGER NOT NULL,
      delay_minutes INTEGER NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/entries", (_req, res) => {
  db.all(
    `SELECT id, teacher, class_name, date, lesson, delay_minutes, status, note, created_by, created_at
     FROM late_entries
     ORDER BY datetime(created_at) DESC
     LIMIT 100`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Fehler beim Laden der Eintraege." });
      }
      return res.json(rows);
    }
  );
});

app.post("/api/entries", (req, res) => {
  const {
    teacher,
    class_name: className,
    date,
    lesson,
    delay_minutes: delayMinutes,
    status,
    note,
    created_by: createdBy,
  } = req.body || {};

  if (
    !teacher ||
    !className ||
    !date ||
    !Number.isInteger(lesson) ||
    !Number.isInteger(delayMinutes) ||
    !status ||
    !createdBy
  ) {
    return res.status(400).json({ error: "Bitte alle Pflichtfelder korrekt ausfuellen." });
  }

  db.run(
    `INSERT INTO late_entries (teacher, class_name, date, lesson, delay_minutes, status, note, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [teacher, className, date, lesson, delayMinutes, status, note || "", createdBy],
    function onInsert(err) {
      if (err) {
        return res.status(500).json({ error: "Eintrag konnte nicht gespeichert werden." });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

app.delete("/api/entries/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Ungueltige Eintrags-ID." });
  }

  db.run("DELETE FROM late_entries WHERE id = ?", [id], function onDelete(err) {
    if (err) {
      return res.status(500).json({ error: "Loeschen fehlgeschlagen." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Eintrag nicht gefunden." });
    }
    return res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server gestartet: http://localhost:${PORT}`);
});
