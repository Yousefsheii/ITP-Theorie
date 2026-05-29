# Lebenslauf mit Datenbank (vollstaendig)

## Schnellstart (damit alles funktioniert)

### 1) Supabase
1. [supabase.com](https://supabase.com) → neues Projekt
2. **SQL Editor** → kompletten Inhalt von `database/seed_full.sql` einfügen → **Run**
3. Unten solltest du sehen:
   - persons: **1**
   - cv_sections: **5**
   - cv_text_variants: **5**
   - cv_items: **15**

### 2) Keys holen
Supabase → **Project Settings** → **API**:
- `Project URL` → `SUPABASE_URL`
- `service_role` Key → `SUPABASE_SERVICE_ROLE_KEY` (geheim halten!)

### 3) Vercel
Project Settings → Environment Variables → beide Keys setzen → **Redeploy**

### 4) Testen
- Seite öffnen
- **DB-Verbindung testen** → soll „Datenbank bereit“ zeigen
- **Neu aus Datenbank laden** → Lebenslauf erscheint
- Mehrmals klicken → Profiltext kann sich ändern

---

## Lokal testen

1. `.env` anlegen (Vorlage: `.env.example`)
2. `npm install`
3. `npm start`
4. Browser: `http://localhost:3000`

---

## Relationales Modell

```
persons (1) ──► cv_sections (n)
                    ├── cv_text_variants (n)  ← wechselnder Profiltext
                    └── cv_items (n)
```

## API

| Route | Beschreibung |
|-------|----------------|
| `GET /api/cv` | Liest kompletten Lebenslauf aus DB |
| `GET /api/health` | Prüft ENV + DB-Verbindung |

## Dateien

- `database/seed_full.sql` – **komplette DB befüllen**
- `api/cv.js` – Datenbank-Request
- `lib/cv-service.js` – Logik
- `server.js` – lokaler Test-Server
