const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setTheme(mode) {
  if (mode === "light") {
    document.documentElement.dataset.theme = "light";
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    localStorage.setItem("ys_theme", mode);
  } catch (_) {}
}

function getTheme() {
  try {
    return localStorage.getItem("ys_theme") || "dark";
  } catch (_) {
    return "dark";
  }
}

function initThemeToggle() {
  const btn = $("#themeToggle");
  if (!btn) return;

  const syncLabel = () => {
    const isLight = document.documentElement.dataset.theme === "light";
    btn.setAttribute("aria-label", isLight ? "Dunkelmodus aktivieren" : "Hellmodus aktivieren");
  };

  syncLabel();
  btn.addEventListener("click", () => {
    const current = getTheme();
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
    syncLabel();
  });
}

function initMobileNav() {
  const toggle = $("#navToggle");
  const nav = $("#mobileNav");
  if (!toggle || !nav) return;

  const icon = toggle.querySelector(".pill__icon");
  const setOpen = (open) => {
    nav.hidden = !open;
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    if (icon) icon.textContent = open ? "×" : "≡";
  };

  setOpen(false);

  toggle.addEventListener("click", () => setOpen(nav.hidden));
  nav.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (a) setOpen(false);
  });
}

function initScrollReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => io.observe(el));
}

function initHeroParallax() {
  const orbs = $$(".parallaxOrb");
  const lines = $$(".parallaxLine");
  if (!orbs.length && !lines.length) return;

  let raf = 0;
  const onMove = (e) => {
    if (raf) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    raf = requestAnimationFrame(() => {
      orbs.forEach((el, i) => {
        const k = (i + 1) * 10;
        el.style.transform = `translate3d(${x * k}px, ${y * k}px, 0)`;
      });
      lines.forEach((el, i) => {
        const k = (i + 1) * 6;
        el.style.transform = `translate3d(${x * k}px, ${y * k}px, 0)`;
      });
      raf = 0;
    });
  };

  window.addEventListener("pointermove", onMove, { passive: true });
}

function animateCounter(el, to, ms = 900) {
  const from = 0;
  const start = performance.now();

  const tick = (t) => {
    const p = Math.min(1, (t - start) / ms);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(from + (to - from) * eased);
    el.textContent = String(val);
    if (p < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = $$(".counter");
  if (!counters.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const to = Number(el.getAttribute("data-to") || "0");
        if (!Number.isFinite(to)) continue;
        if (el.dataset.done === "1") continue;
        el.dataset.done = "1";
        animateCounter(el, to, 980);
      }
    },
    { threshold: 0.25 }
  );

  counters.forEach((c) => io.observe(c));
}

function initContactForm() {
  const form = $("#contactForm");
  const hint = $("#formHint");
  if (!form || !hint) return;

  const setHint = (msg, type) => {
    hint.textContent = msg;
    hint.style.color =
      type === "ok"
        ? "color-mix(in oklab, var(--gold) 70%, var(--text))"
        : type === "warn"
          ? "color-mix(in oklab, var(--crimson2) 70%, var(--text))"
          : "var(--muted2)";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setHint("", "idle");

    if (!form.checkValidity()) {
      setHint("Bitte fülle alle Felder korrekt aus (Demo-Validierung).", "warn");
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    setHint(`Danke, ${name || "du"} — Nachricht wurde in dieser Demo „simuliert“ gespeichert.`, "ok");
    form.reset();
  });
}

function initNiceAnchors() {
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  });
}

initThemeToggle();
initMobileNav();
initNiceAnchors();
initScrollReveal();
initHeroParallax();
initCounters();
initContactForm();

