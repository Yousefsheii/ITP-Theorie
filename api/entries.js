const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase ENV Variablen fehlen.");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

module.exports = async function handler(req, res) {
  try {
    const supabase = getClient();

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("late_entries")
        .select("id, teacher, class_name, date, lesson, delay_minutes, status, note, created_by, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        return res.status(500).json({ error: "Fehler beim Laden der Eintraege." });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const {
        teacher,
        class_name: className,
        date,
        lesson,
        delay_minutes: delayMinutes,
        status,
        note,
        created_by: createdBy,
      } = req.body || {};

      if (
        !teacher ||
        !className ||
        !date ||
        !Number.isInteger(lesson) ||
        !Number.isInteger(delayMinutes) ||
        !status ||
        !createdBy
      ) {
        return res.status(400).json({ error: "Bitte alle Pflichtfelder korrekt ausfuellen." });
      }

      const { data, error } = await supabase
        .from("late_entries")
        .insert({
          teacher,
          class_name: className,
          date,
          lesson,
          delay_minutes: delayMinutes,
          status,
          note: note || "",
          created_by: createdBy,
        })
        .select("id")
        .single();

      if (error) {
        return res.status(500).json({ error: "Eintrag konnte nicht gespeichert werden." });
      }

      return res.status(201).json({ id: data.id });
    }

    if (req.method === "DELETE") {
      const id = Number(req.query.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Ungueltige Eintrags-ID." });
      }

      const { error } = await supabase.from("late_entries").delete().eq("id", id);

      if (error) {
        return res.status(500).json({ error: "Loeschen fehlgeschlagen." });
      }

      return res.status(204).send();
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Methode nicht erlaubt." });
  } catch (_error) {
    return res.status(500).json({
      error: "Server-Konfiguration fehlt. Bitte SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY setzen.",
    });
  }
};
