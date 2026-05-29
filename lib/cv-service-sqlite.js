const { pickRandomVariant } = require("./cv-service");

function getCvData(database) {
  const person = database
    .prepare(
      `SELECT id, full_name, job_title, email, phone, location
       FROM persons ORDER BY id LIMIT 1`
    )
    .get();

  if (!person) {
    throw new Error("Keine Person in der SQLite-Datenbank.");
  }

  const sections = database
    .prepare(
      `SELECT id, section_key, title, sort_order
       FROM cv_sections WHERE person_id = ? ORDER BY sort_order`
    )
    .all(person.id);

  if (!sections.length) {
    throw new Error("Keine Abschnitte in der Datenbank.");
  }

  const variants = database
    .prepare(`SELECT id, section_id, content, is_active FROM cv_text_variants`)
    .all();

  const items = database
    .prepare(
      `SELECT id, section_id, headline, subline, description, period_from, period_to, sort_order
       FROM cv_items ORDER BY sort_order`
    )
    .all();

  const variantsBySection = {};
  for (const variant of variants) {
    if (!variantsBySection[variant.section_id]) variantsBySection[variant.section_id] = [];
    variantsBySection[variant.section_id].push({
      ...variant,
      is_active: variant.is_active === 1,
    });
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
    database: "SQLite",
    note: "Profiltext wird bei jedem Request per SQL SELECT aus cv_text_variants gelesen.",
  };
}

module.exports = { getCvData };
