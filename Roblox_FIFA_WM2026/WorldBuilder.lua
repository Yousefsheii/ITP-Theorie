--[[
  FIFA WM 2026 – World Builder
  Einmal in Roblox Studio ausfuehren (Command Bar oder temporäres Script).

  Anleitung:
  1. Neues Place erstellen oder bestehendes oeffnen
  2. Dieses Skript in ServerScriptService legen ODER Inhalt in Command Bar einfügen
  3. Play druecken (einmal) – Welt wird gebaut
  4. Danach WorldBuilder wieder loeschen (nur einmal noetig)
  5. Dein MainScript in ServerScriptService legen
]]

local Workspace = game:GetService("Workspace")
local Lighting = game:GetService("Lighting")
local Teams = game:GetService("Teams")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Alte Version entfernen (optional)
local alterOrdner = Workspace:FindFirstChild("WM2026_Welt")
if alterOrdner then
	alterOrdner:Destroy()
end

local welt = Instance.new("Folder")
welt.Name = "WM2026_Welt"
welt.Parent = Workspace

-- Hilfsfunktionen
local function part(name, size, pos, color, parent, transparency)
	local p = Instance.new("Part")
	p.Name = name
	p.Size = size
	p.Anchored = true
	p.Position = pos
	p.BrickColor = BrickColor.new(color or "Medium stone grey")
	p.Material = Enum.Material.SmoothPlastic
	p.Transparency = transparency or 0
	p.Parent = parent
	return p
end

local function ordner(name, parent)
	local f = Instance.new("Folder")
	f.Name = name
	f.Parent = parent
	return f
end

local function spotLight(parent, brightness)
	local sl = Instance.new("SpotLight")
	sl.Name = "Flutlicht"
	sl.Brightness = brightness or 3
	sl.Range = 60
	sl.Angle = 45
	sl.Enabled = false
	sl.Parent = parent
	return sl
end

local function particleEmitter(parent, texture, rate)
	local pe = Instance.new("ParticleEmitter")
	pe.Texture = texture or "rbxasset://textures/particles/sparkles_main.dds"
	pe.Rate = rate or 80
	pe.Lifetime = NumberRange.new(2, 4)
	pe.Speed = NumberRange.new(5, 15)
	pe.SpreadAngle = Vector2.new(45, 45)
	pe.Enabled = false
	pe.Parent = parent
	return pe
end

-- ═══════════════════════════════════════
-- TEAMS
-- ═══════════════════════════════════════
for _, tName in ipairs({"Heimteam", "Gastteam"}) do
	if not Teams:FindFirstChild(tName) then
		local team = Instance.new("Team")
		team.Name = tName
		team.TeamColor = tName == "Heimteam" and BrickColor.new("Bright blue") or BrickColor.new("Bright red")
		team.AutoAssignable = false
		team.Parent = Teams
	end
end

-- ═══════════════════════════════════════
-- LIGHTING
-- ═══════════════════════════════════════
Lighting.Technology = Enum.Technology.Future
Lighting.ClockTime = 14
Lighting.Brightness = 2

if not Lighting:FindFirstChildOfClass("Atmosphere") then
	local atmo = Instance.new("Atmosphere")
	atmo.Density = 0.3
	atmo.Haze = 0
	atmo.Parent = Lighting
end

if not Lighting:FindFirstChildOfClass("Sky") then
	local sky = Instance.new("Sky")
	sky.Parent = Lighting
end

-- ═══════════════════════════════════════
-- LOBBY & ZONEN
-- ═══════════════════════════════════════
local lobby = part("LobbySpawn", Vector3.new(30, 1, 30), Vector3.new(0, 0.5, 0), "Bright green", welt)
lobby.Material = Enum.Material.Grass

-- Zonen-Marker (fuer Teleport)
local zonenOrdner = ordner("Zonen", welt)
local zonenDaten = {
	{name = "USA",    pos = Vector3.new(500, 0.5, 200),  color = "Bright red"},
	{name = "Kanada", pos = Vector3.new(-800, 0.5, -300), color = "White"},
	{name = "Mexiko", pos = Vector3.new(200, 0.5, 900),  color = "Bright green"},
}
for _, z in ipairs(zonenDaten) do
	local marker = part(z.name .. "_Marker", Vector3.new(40, 1, 40), z.pos, z.color, zonenOrdner, 0.3)
	local label = Instance.new("BillboardGui")
	label.Size = UDim2.new(0, 200, 0, 50)
	label.StudsOffset = Vector3.new(0, 8, 0)
	label.AlwaysOnTop = true
	label.Parent = marker
	local txt = Instance.new("TextLabel")
	txt.Size = UDim2.new(1, 0, 1, 0)
	txt.BackgroundTransparency = 1
	txt.Text = z.name
	txt.TextColor3 = Color3.new(1, 1, 1)
	txt.TextScaled = true
	txt.Font = Enum.Font.GothamBold
	txt.Parent = label
end

-- ═══════════════════════════════════════
-- STADIEN
-- ═══════════════════════════════════════
local stadienOrdner = ordner("Stadien", welt)

local STADIEN = {
	{name = "MetLife Stadium",  pos = Vector3.new(520, 0, 180),  zone = "USA",    farbe = "Bright blue"},
	{name = "SoFi Stadium",     pos = Vector3.new(700, 0, 350),  zone = "USA",    farbe = "Cyan"},
	{name = "AT&T Stadium",     pos = Vector3.new(900, 0, 500),  zone = "USA",    farbe = "Deep blue"},
	{name = "BMO Field",        pos = Vector3.new(-820, 0, -280), zone = "Kanada", farbe = "White"},
	{name = "Estadio Azteca",   pos = Vector3.new(220, 0, 870),  zone = "Mexiko", farbe = "Bright green"},
	{name = "Estadio BBVA",     pos = Vector3.new(350, 0, 1050), zone = "Mexiko", farbe = "Lime green"},
}

for i, stadion in ipairs(STADIEN) do
	local stadionModel = Instance.new("Model")
	stadionModel.Name = stadion.name
	stadionModel.Parent = stadienOrdner

	-- Spielfeld
	local feld = part("Spielfeld", Vector3.new(80, 1, 50), stadion.pos + Vector3.new(0, 0.5, 0), "Bright green", stadionModel)
	feld.Material = Enum.Material.Grass

	-- Tribuenen (4 Seiten)
	local tribueneGroesse = {
		{Vector3.new(82, 8, 6),  Vector3.new(0, 4, -28)},
		{Vector3.new(82, 8, 6),  Vector3.new(0, 4, 28)},
		{Vector3.new(6, 8, 52),   Vector3.new(-43, 4, 0)},
		{Vector3.new(6, 8, 52),   Vector3.new(43, 4, 0)},
	}
	for j, t in ipairs(tribueneGroesse) do
		part("Tribuene" .. j, t[1], stadion.pos + t[2], "Dark stone grey", stadionModel)
	end

	-- Tor
	local torModel = Instance.new("Model")
	torModel.Name = stadion.name .. "_Tor"
	torModel.Parent = stadionModel

	local torPos = stadion.pos + Vector3.new(0, 3, -25)
	local torBereich = part("TorBereich", Vector3.new(12, 8, 2), torPos, "Bright yellow", torModel, 0.85)
	torBereich.CanCollide = false

	-- Torpfosten
	part("PfostenLinks",  Vector3.new(0.5, 6, 0.5), torPos + Vector3.new(-5, 0, 0), "White", torModel)
	part("PfostenRechts", Vector3.new(0.5, 6, 0.5), torPos + Vector3.new(5, 0, 0),  "White", torModel)
	part("Latte",         Vector3.new(10, 0.5, 0.5), torPos + Vector3.new(0, 3, 0),  "White", torModel)

	-- Feuerwerk-Punkte
	local fwOrdner = ordner("FeuerwerkPunkte", stadionModel)
	for k = 1, 6 do
		local winkel = (k / 6) * math.pi * 2
		local fwPos = stadion.pos + Vector3.new(math.cos(winkel) * 35, 15, math.sin(winkel) * 35)
		part("FW" .. k, Vector3.new(1, 1, 1), fwPos, "Bright yellow", fwOrdner)
	end

	-- Konfetti-Punkte
	local konfettiOrdner = ordner("KonfettiPunkte", stadionModel)
	for k = 1, 4 do
		local kPos = stadion.pos + Vector3.new(math.random(-30, 30), 20, math.random(-20, 20))
		local kp = part("Konfetti" .. k, Vector3.new(2, 2, 2), kPos, "Hot pink", konfettiOrdner, 1)
		kp.CanCollide = false
		particleEmitter(kp, "rbxasset://textures/particles/sparkles_main.dds", 120)
	end

	-- Flutlichter
	for k = 1, 4 do
		local lichtPos = stadion.pos + Vector3.new(
			(k <= 2) and -35 or 35,
			25,
			(k % 2 == 0) and 20 or -20
		)
		local lichtTeil = part("FlutlichtTeil" .. k, Vector3.new(2, 2, 2), lichtPos, "Black", stadionModel)
		spotLight(lichtTeil, 4)
	end

	-- Zuschauer-Reihen (La-Ola)
	local zuschauerOrdner = ordner("ZuschauerReihen", stadionModel)
	for reihe = 1, 5 do
		local reiheOrdner = ordner("Reihe" .. reihe, zuschauerOrdner)
		for npc = 1, 8 do
			local npcModel = Instance.new("Model")
			npcModel.Name = "Zuschauer" .. npc

			local koerper = part("Torso", Vector3.new(2, 3, 1),
				stadion.pos + Vector3.new(-35 + reihe * 3, 6 + reihe, -20 + npc * 2),
				"Bright " .. ({"blue","red","yellow","green","orange"})[((reihe + npc) % 5) + 1],
				npcModel)
			npcModel.PrimaryPart = koerper

			local kopf = part("Head", Vector3.new(1.5, 1.5, 1.5), koerper.Position + Vector3.new(0, 2.5, 0), "Peach", npcModel)
			local hum = Instance.new("Humanoid")
			hum.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None
			hum.Parent = npcModel

			npcModel.Parent = reiheOrdner
		end
	end

	-- Verkaeufer-NPCs
	local verkaeuferOrdner = ordner("Verkaeufer_NPCs", stadionModel)
	for v = 1, 2 do
		local vModel = Instance.new("Model")
		vModel.Name = "Verkaeufer" .. v
		local vKoerper = part("Torso", Vector3.new(2, 3, 1), stadion.pos + Vector3.new(30 + v * 5, 3, 0), "Bright orange", vModel)
		vModel.PrimaryPart = vKoerper
		Instance.new("Humanoid", vModel)
		vModel.Parent = verkaeuferOrdner
	end

	-- Spawn-Punkt pro Stadion
	part("Spawn" .. stadion.name, Vector3.new(6, 1, 6), stadion.pos + Vector3.new(0, 1, 35), stadion.farbe, stadionModel, 0.5)

	print("[WorldBuilder] Stadion erstellt:", stadion.name)
end

-- Stadien auch direkt unter Workspace (MainScript sucht dort)
for _, stadionModel in ipairs(stadienOrdner:GetChildren()) do
	if stadionModel:IsA("Model") then
		local kopie = stadionModel:Clone()
		kopie.Parent = Workspace
	end
end

-- ═══════════════════════════════════════
-- REGEN-PARTIKEL
-- ═══════════════════════════════════════
local regenOrdner = ordner("RegenPartikel", welt)
for r = 1, 20 do
	local regenTeil = part("Regen" .. r, Vector3.new(200, 1, 200),
		Vector3.new(math.random(-200, 200), 80, math.random(-200, 200)), "Light blue", regenOrdner, 1)
	regenTeil.CanCollide = false
	local pe = particleEmitter(regenTeil, "rbxasset://textures/particles/rain.png", 300)
	pe.Acceleration = Vector3.new(0, -50, 0)
	pe.Enabled = false
end
local regenKopie = regenOrdner:Clone()
regenKopie.Name = "RegenPartikel"
regenKopie.Parent = Workspace

-- ═══════════════════════════════════════
-- LOOTBOXEN
-- ═══════════════════════════════════════
local lootOrdner = ordner("Lootboxen", welt)
for l = 1, 8 do
	local box = part("Lootbox" .. l, Vector3.new(4, 4, 4),
		Vector3.new(math.random(-80, 80), 2, math.random(-80, 80)), "Bright violet", lootOrdner)
	box.Material = Enum.Material.Neon
	local glow = Instance.new("PointLight")
	glow.Color = Color3.fromRGB(180, 80, 255)
	glow.Range = 12
	glow.Parent = box
end
local lootKopie = lootOrdner:Clone()
lootKopie.Parent = Workspace

-- ═══════════════════════════════════════
-- DRIBBLING-PARCOURS
-- ═══════════════════════════════════════
local parcours = ordner("DribblingParcours", welt)
local cpStart = Vector3.new(-150, 1, 50)
for cp = 1, 10 do
	local cpPart = part("CP" .. cp, Vector3.new(6, 1, 6),
		cpStart + Vector3.new(cp * 12, 0, math.sin(cp) * 8),
		"Bright orange", parcours, 0.4)
	cpPart.Material = Enum.Material.Neon
end
local parcoursKopie = parcours:Clone()
parcoursKopie.Parent = Workspace

-- ═══════════════════════════════════════
-- FREISTOSS-CHALLENGE
-- ═══════════════════════════════════════
local fsSpawn = part("FreistossSpawn", Vector3.new(8, 1, 8), Vector3.new(-200, 1, 100), "Bright yellow", welt, 0.3)
fsSpawn.Parent = Workspace

local fsTor = Instance.new("Model")
fsTor.Name = "FreistossChallenge_Tor"
fsTor.Parent = Workspace
part("TorBereich", Vector3.new(14, 10, 2), Vector3.new(-200, 5, 130), "Bright yellow", fsTor, 0.85).CanCollide = false

-- Torwart
local torwart = Instance.new("Model")
torwart.Name = "TorwartNPC"
torwart.Parent = Workspace
local twKoerper = part("Torso", Vector3.new(2, 3, 1), Vector3.new(-200, 3, 125), "Black", torwart)
torwart.PrimaryPart = twKoerper
part("Head", Vector3.new(1.5, 1.5, 1.5), twKoerper.Position + Vector3.new(0, 2.5, 0), "Bright yellow", torwart)
local twHum = Instance.new("Humanoid", torwart)
twHum.WalkSpeed = 12

-- ═══════════════════════════════════════
-- FAN-ZONE NPCs
-- ═══════════════════════════════════════
local fanZone = ordner("FanZone_NPCs", welt)
for f = 1, 12 do
	local fan = Instance.new("Model")
	fan.Name = "Fan" .. f
	local fanKoerper = part("Torso", Vector3.new(2, 3, 1),
		Vector3.new(-50 + f * 4, 3, -50), "Bright blue", fan)
	fan.PrimaryPart = fanKoerper
	Instance.new("Humanoid", fan).WalkSpeed = 16
	fan.Parent = fanZone
end
local fanKopie = fanZone:Clone()
fanKopie.Parent = Workspace

-- ═══════════════════════════════════════
-- EASTER EGGS
-- ═══════════════════════════════════════
local eggs = {
	{name = "EasterEgg_Pressezimmer",  pos = Vector3.new(230, 3, 890),  color = "Gold"},
	{name = "EasterEgg_Trophaee1970",  pos = Vector3.new(210, 3, 920),  color = "Gold"},
	{name = "EasterEgg_Trikot1994",    pos = Vector3.new(510, 3, 210),  color = "Gold"},
	{name = "EasterEgg_Dach_Toronto",  pos = Vector3.new(-810, 15, -270), color = "Gold"},
}
for _, egg in ipairs(eggs) do
	local eggPart = part(egg.name, Vector3.new(3, 3, 3), egg.pos, egg.color, welt, 0.2)
	eggPart.Shape = Enum.PartType.Ball
	eggPart.Material = Enum.Material.Neon
end
-- Easter Eggs auch direkt im Workspace (MainScript sucht mit FindFirstChild(..., true))
for _, egg in ipairs(eggs) do
	local eggPart = part(egg.name, Vector3.new(3, 3, 3), egg.pos, egg.color, Workspace, 0.2)
	eggPart.Shape = Enum.PartType.Ball
	eggPart.Material = Enum.Material.Neon
end

-- ═══════════════════════════════════════
-- REMOTES (falls noch nicht vorhanden)
-- ═══════════════════════════════════════
local remotes = ReplicatedStorage:FindFirstChild("Remotes")
if not remotes then
	remotes = Instance.new("Folder")
	remotes.Name = "Remotes"
	remotes.Parent = ReplicatedStorage
end
for _, evName in ipairs({"TorGeschossen", "WetterGewechselt", "LootboxGeoeffnet", "ZoneTeleport", "HUDAktualisieren"}) do
	if not remotes:FindFirstChild(evName) then
		Instance.new("RemoteEvent", remotes).Name = evName
	end
end

-- ═══════════════════════════════════════
-- FERTIG
-- ═══════════════════════════════════════
print("============================================")
print("  FIFA WM 2026 – Welt erfolgreich erstellt!")
print("  Ordner: Workspace > WM2026_Welt")
print("  Stadien, Lootboxen, Parcours, NPCs, Eggs")
print("  Naechster Schritt: MainScript starten")
print("============================================")
