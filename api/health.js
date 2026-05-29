const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(_req, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return res.status(500).json({
      ok: false,
      env: false,
      message: "SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt.",
    });
  }

  try {
    const supabase = createClient(url, key);
    const { count, error } = await supabase
      .from("persons")
      .select("*", { count: "exact", head: true });

    if (error) {
      return res.status(500).json({ ok: false, env: true, db: false, message: error.message });
    }

    return res.status(200).json({
      ok: true,
      env: true,
      db: true,
      persons: count ?? 0,
      message: count > 0 ? "Datenbank bereit." : "Tabellen da, aber keine Person – seed_full.sql ausfuehren.",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};
