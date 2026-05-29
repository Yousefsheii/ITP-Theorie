# Vercel + Supabase einrichten (5 Minuten)

## Schritt 1: Supabase Keys holen

1. [supabase.com](https://supabase.com) → dein Projekt öffnen
2. Links: **Project Settings** (Zahnrad)
3. **API**
4. Kopieren:
   - **Project URL** → das ist `SUPABASE_URL`
   - **service_role** (unter Project API keys) → das ist `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **NICHT** den `anon` Key verwenden!

## Schritt 2: Datenbank füllen

1. Supabase → **SQL Editor** → New query
2. Kompletten Inhalt von `database/seed_full.sql` einfügen
3. **Run** klicken
4. Ergebnis prüfen: persons=1, sections=5, variants=5, items=15

## Schritt 3: Vercel Environment Variables

1. [vercel.com](https://vercel.com) → dein Projekt (ITP-Theorie)
2. **Settings** → **Environment Variables**
3. Zwei Variablen anlegen:

| Name | Value |
|------|--------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` (deine Project URL) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` (service_role Key) |

4. Environment: **Production** (und optional Preview) ankreuzen
5. **Save**

## Schritt 4: Redeploy

1. **Deployments** Tab
2. Beim letzten Deployment: **⋯** → **Redeploy**
3. Oder: neuen Commit pushen

## Schritt 5: Testen

- Seite öffnen
- **DB-Verbindung testen** → „Datenbank bereit“
- **Neu aus Datenbank laden** → Lebenslauf erscheint

## Häufige Fehler

| Fehler | Lösung |
|--------|--------|
| Server-Konfiguration fehlt | Keys in Vercel setzen + Redeploy |
| Keine Person in DB | `seed_full.sql` in Supabase ausführen |
| relation does not exist | `seed_full.sql` ausführen (erstellt Tabellen) |
| Invalid API key | `service_role` Key, nicht `anon` |
