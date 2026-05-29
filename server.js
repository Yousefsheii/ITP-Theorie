require("dotenv").config();

const express = require("express");
const path = require("path");
const cvHandler = require("./api/cv");
const healthHandler = require("./api/health");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/cv", (req, res) => cvHandler(req, res));
app.get("/api/health", (req, res) => healthHandler(req, res));
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Lebenslauf laeuft: http://localhost:${PORT}`);
  console.log(`Health-Check: http://localhost:${PORT}/api/health`);
});
