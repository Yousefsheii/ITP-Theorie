# Zuspaetkommen Protokoll mit Datenbank

Web-App fuer gemeinsames Eintragen von Zuspaetkommen.  
Eintraege werden zentral in einer SQLite-Datenbank gespeichert, damit mehrere Personen dieselben Daten sehen.

## Funktionen
- modernes, responsives UI
- neue Eintraege speichern
- letzte Eintraege fuer alle anzeigen
- Eintraege loeschen
- Speicherung in `data.db` (SQLite)

## Starten
```bash
npm install
npm start
```

Danach im Browser oeffnen: `http://localhost:3000`

## Wichtige Dateien
- `server.js` - API + Datenbank + statische Auslieferung
- `index.html` - Oberflaeche
- `styles.css` - Design
- `script.js` - Frontend-Logik und API-Aufrufe
