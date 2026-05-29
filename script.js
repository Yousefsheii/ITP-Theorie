const fullNameEl = document.getElementById("fullName");
const jobTitleEl = document.getElementById("jobTitle");
const metaEl = document.getElementById("meta");
const statusEl = document.getElementById("status");
const statsEl = document.getElementById("stats");
const cvContentEl = document.getElementById("cvContent");
const reloadBtn = document.getElementById("reloadBtn");
const healthBtn = document.getElementById("healthBtn");

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}

function renderCv(data) {
  fullNameEl.textContent = data.person.full_name;
  jobTitleEl.textContent = data.person.job_title || "";
  metaEl.textContent = [data.person.email, data.person.phone, data.person.location]
    .filter(Boolean)
    .join(" · ");

  if (data.stats) {
    statsEl.textContent = `SQLite: ${data.stats.sections} Abschnitte · ${data.stats.textVariants} Textvarianten · ${data.stats.items} Eintraege`;
  }

  cvContentEl.innerHTML = data.sections
    .map((section) => {
      const itemsHtml = section.items
        .map(
          (item) => `
          <article class="item">
            <h3>${escapeHtml(item.headline)}</h3>
            ${item.subline ? `<p class="subline">${escapeHtml(item.subline)}</p>` : ""}
            ${item.period ? `<p class="period">${escapeHtml(item.period)}</p>` : ""}
            ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
          </article>
        `
        )
        .join("");

      const dynamicHtml =
        section.key === "about" && section.dynamicText
          ? `<p class="dynamic-text">${escapeHtml(section.dynamicText)}</p>
             <p class="db-hint">Profiltext per SQL SELECT aus cv_text_variants (zufaellige Variante).</p>`
          : "";

      return `
        <section class="card">
          <h2>${escapeHtml(section.title)}</h2>
          ${dynamicHtml}
          ${itemsHtml || "<p class='db-hint'>Keine Eintraege.</p>"}
        </section>
      `;
    })
    .join("");

  cvContentEl.hidden = false;
  setStatus(`Erfolgreich aus SQLite geladen (${new Date(data.loadedAt).toLocaleString("de-AT")}).`);
}

async function loadCvFromDatabase() {
  setStatus("SQL-Request: SELECT aus SQLite …");
  statsEl.textContent = "";
  cvContentEl.hidden = true;

  try {
    const response = await fetch("/api/cv");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Daten konnten nicht geladen werden.");
    }

    renderCv(data);
  } catch (error) {
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      setStatus("Server nicht erreichbar. Bitte npm start ausfuehren und localhost:3000 oeffnen.", true);
    } else {
      setStatus(error.message, true);
    }
  }
}

async function testDatabaseConnection() {
  setStatus("Teste SQLite-Verbindung …");
  try {
    const response = await fetch("/api/health");
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Verbindung fehlgeschlagen.");
    }

    setStatus(data.message);
    statsEl.textContent = `Personen: ${data.persons} · Abschnitte: ${data.sections} · Eintraege: ${data.items}`;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      setStatus("Server laeuft nicht. Terminal: npm install && npm start", true);
    } else {
      setStatus(error.message, true);
    }
  }
}

reloadBtn.addEventListener("click", loadCvFromDatabase);
healthBtn.addEventListener("click", testDatabaseConnection);

loadCvFromDatabase();
