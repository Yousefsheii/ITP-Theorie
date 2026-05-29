# FIFA WM 2026 – Roblox Welt erstellen

## Was du bekommst

Das Skript `WorldBuilder.lua` erstellt automatisch in Roblox Studio:

- 6 Stadien (MetLife, SoFi, AT&T, BMO, Azteca, BBVA)
- Tore mit `TorBereich` (für Tor-Erkennung)
- Feuerwerk- und Konfetti-Punkte
- Zuschauer-Reihen (La-Ola)
- Flutlichter
- Lobby-Spawn
- Zonen-Marker (USA, Kanada, Mexiko)
- Lootboxen
- Dribbling-Parcours (10 Checkpoints)
- Freistoß-Challenge (Spawn + Tor + Torwart)
- Fan-Zone NPCs
- Easter Eggs
- Teams (Heimteam / Gastteam)
- RemoteEvents in ReplicatedStorage

---

## Schritt-für-Schritt in Roblox Studio

### 1) Neues Place erstellen
- Roblox Studio öffnen
- **New** → **Baseplate** (oder leer)

### 2) World Builder einfügen
- `ServerScriptService` → Rechtsklick → **Insert Object** → **Script**
- Name: `WorldBuilder`
- Inhalt aus `WorldBuilder.lua` komplett reinkopieren

### 3) Einmal ausführen
- **Play** (F5) drücken
- In der **Output**-Konsole sollte stehen: `Welt erfolgreich erstellt!`
- **Stop** drücken

### 4) WorldBuilder wieder löschen
- `WorldBuilder`-Script in ServerScriptService **löschen** (nur einmal nötig)

### 5) Dein MainScript einfügen
- Neues Script in `ServerScriptService` → Name: `MainScript`
- Dein großes FIFA-Skript dort einfügen

### 6) Nochmal Play
- Jetzt laufen Wetter, Tag/Nacht, Lootboxen, NPCs usw.

---

## Wichtige Anpassungen in deinem MainScript

### Tor-Erkennung (Bugfix)
In deinem Skript sucht `BallSystem:IstTor` das Tor direkt in `workspace`.
Der WorldBuilder legt Tore unter `Stadien/[Name]/[Name]_Tor` ab.

**Ersetze in `BallSystem:IstTor`:**
```lua
local tor = workspace:FindFirstChild(torName)
```
**durch:**
```lua
local tor = workspace:FindFirstChild(torName, true)
```

### Wetter-Sound Event (Bugfix)
`evWetter.OnServerEvent` ist falsch – Wetter wechselt serverseitig.
Besser direkt in `WetterSystem:Wechseln` nach dem Wechsel:
```lua
if neuesWetter == "Regen" then
    AudioManager:RegenSoundStarten()
else
    AudioManager:RegenSoundStoppen()
end
```

### Audio-IDs ersetzen
Alle `rbxassetid://1234560001` usw. durch echte Sound-IDs aus dem Roblox Creator Dashboard ersetzen.

---

## Optional: Client-HUD (LocalScript)

Für Anzeigen (Tor, Lootbox, Minispiele) brauchst du noch ein **LocalScript** in `StarterPlayerScripts`:

```lua
local Remotes = game.ReplicatedStorage:WaitForChild("Remotes")
local hud = Remotes:WaitForChild("HUDAktualisieren")

hud.OnClientEvent:Connect(function(data)
    print("[HUD]", data.typ, data)
    -- Hier ScreenGui mit TextLabels aktualisieren
end)
```

---

## Test-Checkliste

- [ ] Output zeigt `Alle Systeme aktiv`
- [ ] Beim Betreten spawnt man in der Lobby (grüne Fläche)
- [ ] Lootbox berührt → Meldung in Output
- [ ] Ball ins Tor → Feuerwerk + Konfetti
- [ ] Wetter wechselt nach 5 Minuten (CONFIG = 300 Sek)

---

## Nächste Schritte (schöner machen)

1. Echte 3D-Modelle aus Toolbox für Stadien importieren
2. Terrain für USA/Kanada/Mexiko-Zonen
3. Eigene Animationen für NPCs hochladen
4. GUI-Design für Scoreboard und Minispiele
