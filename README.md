# Lebenslauf mit SQLite (ohne Vercel/Supabase)

## Anforderungen erfuellt

- **Datenbankverbindung:** SQLite (`database/cv.db`)
- **Relational:** `persons` → `cv_sections` → `cv_text_variants` / `cv_items`
- **Request aus DB:** `GET /api/cv` (SQL SELECT)
- **Wechselnder Text:** Profil aus `cv_text_variants` (zufaellig pro Request)

## Starten

```bash
npm install
npm start
```

Browser: **http://localhost:3000**

- **DB-Verbindung testen** → SQLite OK
- **Neu aus Datenbank laden** → Lebenslauf erscheint

## Datenbank

- Datei: `database/cv.db` (wird beim ersten Start automatisch erstellt)
- Schema: `database/sqlite_init.sql`
- Daten werden beim ersten Start automatisch eingefuegt

## Relationales Modell

```
persons (1) ──► cv_sections (n)
                    ├── cv_text_variants (n)
                    └── cv_items (n)
```

## Wichtig

- **Nicht** `index.html` direkt im Browser oeffnen (file://)
- Immer ueber `npm start` → `http://localhost:3000`
- Vercel/Supabase wird **nicht** mehr benoetigt

## Dateien

- `server.js` – Express + API
- `lib/db.js` – SQLite Verbindung + Seed
- `lib/cv-service-sqlite.js` – SELECT-Abfragen
- `database/sqlite_init.sql` – Tabellen
