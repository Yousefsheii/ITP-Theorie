const form = document.getElementById("entryForm");
const entriesEl = document.getElementById("entries");
const messageEl = document.getElementById("message");
const reloadBtn = document.getElementById("reloadBtn");
const clearBtn = document.getElementById("clearBtn");

const fields = {
  createdBy: document.getElementById("createdBy"),
  teacher: document.getElementById("teacher"),
  className: document.getElementById("className"),
  date: document.getElementById("date"),
  lesson: document.getElementById("lesson"),
  delayMinutes: document.getElementById("delayMinutes"),
  status: document.getElementById("status"),
  note: document.getElementById("note"),
};

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#fca5a5" : "#94a3b8";
}

function resetForm() {
  form.reset();
  fields.date.valueAsDate = new Date();
}

function formatDate(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("de-AT");
}

function renderEntries(entries) {
  if (!entries.length) {
    entriesEl.innerHTML = "<p class='message'>Noch keine Eintraege vorhanden.</p>";
    return;
  }

  entriesEl.innerHTML = entries
    .map(
      (entry) => `
      <article class="entryCard">
        <div class="entryHead">
          <h3 class="entryTitle">${entry.lesson}. Stunde - ${entry.class_name}</h3>
          <button class="danger" data-id="${entry.id}" type="button">Loeschen</button>
        </div>
        <p class="entryMeta">${entry.teacher} | ${entry.delay_minutes} Minuten | ${entry.status}</p>
        <p class="entryMeta">Datum: ${formatDate(entry.date)}</p>
        <p class="entryNote">${entry.note || "Keine Notiz"}</p>
        <div class="entryFoot">
          <span>Von: ${entry.created_by}</span>
          <span>${new Date(entry.created_at).toLocaleString("de-AT")}</span>
        </div>
      </article>
    `
    )
    .join("");
}

async function loadEntries() {
  try {
    const response = await fetch("/api/entries");
    if (!response.ok) throw new Error("Eintraege konnten nicht geladen werden.");
    const data = await response.json();
    renderEntries(data);
  } catch (error) {
    setMessage(error.message, true);
  }
}

async function addEntry(payload) {
  const response = await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Speichern fehlgeschlagen. API nicht erreichbar.");
  }
}

async function deleteEntry(id) {
  const response = await fetch(`/api/entries?id=${id}`, { method: "DELETE" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Loeschen fehlgeschlagen.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    created_by: fields.createdBy.value.trim(),
    teacher: fields.teacher.value.trim(),
    class_name: fields.className.value.trim(),
    date: fields.date.value,
    lesson: Number(fields.lesson.value),
    delay_minutes: Number(fields.delayMinutes.value),
    status: fields.status.value,
    note: fields.note.value.trim(),
  };

  try {
    await addEntry(payload);
    setMessage("Eintrag wurde in der Datenbank gespeichert.");
    resetForm();
    await loadEntries();
  } catch (error) {
    setMessage(error.message, true);
  }
});

entriesEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (!window.confirm("Diesen Eintrag wirklich loeschen?")) return;

  try {
    await deleteEntry(id);
    setMessage("Eintrag geloescht.");
    await loadEntries();
  } catch (error) {
    setMessage(error.message, true);
  }
});

reloadBtn.addEventListener("click", loadEntries);
clearBtn.addEventListener("click", resetForm);

fields.date.valueAsDate = new Date();
loadEntries();