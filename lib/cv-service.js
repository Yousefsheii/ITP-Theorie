function pickRandomVariant(variants) {
  const active = (variants || []).filter((v) => v.is_active);
  if (!active.length) return "";
  const index = Math.floor(Math.random() * active.length);
  return active[index].content;
}

async function getCvData(supabase) {
  const { data: persons, error: personError } = await supabase
    .from("persons")
    .select("id, full_name, job_title, email, phone, location")
    .order("id", { ascending: true })
    .limit(1);

  if (personError) {
    throw new Error(`Person: ${personError.message}`);
  }

  const person = persons?.[0];
  if (!person) {
    throw new Error("Keine Person in der Datenbank. Bitte database/seed_full.sql ausfuehren.");
  }

  const { data: sections, error: sectionError } = await supabase
    .from("cv_sections")
    .select("id, section_key, title, sort_order")
    .eq("person_id", person.id)
    .order("sort_order", { ascending: true });

  if (sectionError) {
    throw new Error(`Abschnitte: ${sectionError.message}`);
  }

  if (!sections?.length) {
    throw new Error("Keine Abschnitte gefunden. Bitte database/seed_full.sql ausfuehren.");
  }

  const sectionIds = sections.map((s) => s.id);

  let variants = [];
  let items = [];

  if (sectionIds.length > 0) {
    const [variantResult, itemResult] = await Promise.all([
      supabase
        .from("cv_text_variants")
        .select("id, section_id, content, is_active")
        .in("section_id", sectionIds),
      supabase
        .from("cv_items")
        .select(
          "id, section_id, headline, subline, description, period_from, period_to, sort_order"
        )
        .in("section_id", sectionIds)
        .order("sort_order", { ascending: true }),
    ]);

    if (variantResult.error) {
      throw new Error(`Textvarianten: ${variantResult.error.message}`);
    }
    if (itemResult.error) {
      throw new Error(`Eintraege: ${itemResult.error.message}`);
    }

    variants = variantResult.data || [];
    items = itemResult.data || [];
  }

  const variantsBySection = {};
  for (const variant of variants) {
    if (!variantsBySection[variant.section_id]) variantsBySection[variant.section_id] = [];
    variantsBySection[variant.section_id].push(variant);
  }

  const itemsBySection = {};
  for (const item of items) {
    if (!itemsBySection[item.section_id]) itemsBySection[item.section_id] = [];
    itemsBySection[item.section_id].push(item);
  }

  const responseSections = sections.map((section) => ({
    key: section.section_key,
    title: section.title,
    dynamicText: pickRandomVariant(variantsBySection[section.id] || []),
    items: (itemsBySection[section.id] || []).map((item) => ({
      headline: item.headline,
      subline: item.subline,
      description: item.description,
      period:
        item.period_from && item.period_to
          ? `${item.period_from} - ${item.period_to}`
          : item.period_from || item.period_to || "",
    })),
  }));

  return {
    loadedAt: new Date().toISOString(),
    person,
    sections: responseSections,
    stats: {
      sections: sections.length,
      textVariants: variants.length,
      items: items.length,
    },
    note: "Profiltext wird bei jedem Request neu aus der DB gelesen (zufaellige Variante).",
  };
}

module.exports = { getCvData, pickRandomVariant };
