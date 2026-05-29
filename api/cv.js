const { createClient } = require("@supabase/supabase-js");
const { getCvData } = require("../lib/cv-service");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("ENV fehlt");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Nur GET erlaubt." });
  }

  try {
    const supabase = getClient();
    const data = await getCvData(supabase);
    return res.status(200).json(data);
  } catch (error) {
    const message = error.message || "Unbekannter Fehler";

    if (message === "ENV fehlt") {
      return res.status(500).json({
        error: "Server-Konfiguration fehlt. Bitte SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY setzen.",
      });
    }

    if (message.includes("seed_full.sql")) {
      return res.status(404).json({ error: message });
    }

    return res.status(500).json({ error: message });
  }
};
