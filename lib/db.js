const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "..", "database", "cv.db");
const INIT_SQL = path.join(__dirname, "..", "database", "sqlite_init.sql");

let db;

function seedDatabase(database) {
  const personCount = database.prepare("SELECT COUNT(*) AS c FROM persons").get().c;
  if (personCount > 0) return;

  const insertPerson = database.prepare(`
    INSERT INTO persons (full_name, job_title, email, phone, location)
    VALUES (?, ?, ?, ?, ?)
  `);
  const personResult = insertPerson.run(
    "Yousef Sheii",
    "Schueler 4DHIT – Informationstechnik",
    "yousefsheik2@icloud.com",
    "+43 660 0000000",
    "Wien, Oesterreich (TGM)"
  );
  const personId = personResult.lastInsertRowid;

  const sections = [
    ["about", "Profil", 1],
    ["experience", "Berufserfahrung", 2],
    ["education", "Ausbildung", 3],
    ["skills", "Kenntnisse", 4],
    ["languages", "Sprachen", 5],
  ];

  const insertSection = database.prepare(`
    INSERT INTO cv_sections (person_id, section_key, title, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  const sectionIds = {};
  for (const [key, title, order] of sections) {
    const result = insertSection.run(personId, key, title, order);
    sectionIds[key] = result.lastInsertRowid;
  }

  const profileTexts = [
    "Ich bin Yousef Sheii aus der 4DHIT am TGM und entwickle Web-Apps mit SQLite-Datenbank.",
    "Mein Schwerpunkt liegt auf Java, Webentwicklung und strukturierten IT-Projekten in SEW und ITP.",
    "Ich arbeite zuverlaessig im Team, dokumentiere Projekte und setze Anforderungen Schritt fuer Schritt um.",
    "Besonders interessiert mich die Verbindung von Frontend, API und relationaler Datenbank.",
    "Mein Ziel ist eine Ausbildung im IT-Bereich mit Fokus auf Softwareentwicklung.",
  ];

  const insertVariant = database.prepare(`
    INSERT INTO cv_text_variants (section_id, content, is_active) VALUES (?, ?, 1)
  `);
  for (const text of profileTexts) {
    insertVariant.run(sectionIds.about, text);
  }

  const items = [
    [sectionIds.experience, "ITP: Lebenslauf mit Datenbank", "TGM Wien", "Web-App mit SQLite, relationalem Schema und GET /api/cv", "2026", "2026", 1],
    [sectionIds.experience, "SEW: Java-Projekte", "GitHub", "Expressions, FileSystem-Watcher, OOP", "2025", "2026", 2],
    [sectionIds.experience, "Roblox FIFA WM 2026", "Lua", "Wetter, NPCs, Minispiele, Lootboxen", "2026", "2026", 3],
    [sectionIds.education, "TGM – Die Schule der Technik", "4DHIT", "Informationstechnik, 4. Jahrgang", "2022", "2026", 1],
    [sectionIds.education, "Schwerpunkt Softwareentwicklung", "HTL", "Web, Datenbanken, Programmierung", "2022", "2026", 2],
    [sectionIds.skills, "HTML, CSS, JavaScript", "Frontend", "Responsive Websites, Fetch API", "", "", 1],
    [sectionIds.skills, "SQL / SQLite", "Datenbank", "Relationale Tabellen, JOINs, SELECT", "", "", 2],
    [sectionIds.skills, "Java, Git, Node.js", "Tools", "SEW-Projekte, Versionskontrolle", "", "", 3],
    [sectionIds.languages, "Deutsch", "Muttersprache", "Muendlich und schriftlich", "", "", 1],
    [sectionIds.languages, "Englisch", "Schulisch", "Technische Dokumentation", "", "", 2],
  ];

  const insertItem = database.prepare(`
    INSERT INTO cv_items (section_id, headline, subline, description, period_from, period_to, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const row of items) {
    insertItem.run(...row);
  }

  console.log("[DB] SQLite-Datenbank mit Beispieldaten befuellt.");
}

function getDatabase() {
  if (db) return db;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");

  const initSql = fs.readFileSync(INIT_SQL, "utf8");
  db.exec(initSql);
  seedDatabase(db);

  return db;
}

function getStats(database) {
  return {
    persons: database.prepare("SELECT COUNT(*) AS c FROM persons").get().c,
    sections: database.prepare("SELECT COUNT(*) AS c FROM cv_sections").get().c,
    textVariants: database.prepare("SELECT COUNT(*) AS c FROM cv_text_variants").get().c,
    items: database.prepare("SELECT COUNT(*) AS c FROM cv_items").get().c,
  };
}

module.exports = { getDatabase, getStats, DB_PATH };
