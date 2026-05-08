const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setTheme(mode) {
  if (mode === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    delete document.documentElement.dataset.theme;
  }

  try {
    localStorage.setItem("ys_theme", mode);
  } catch (_) {}
}

function getTheme() {
  try {
    return localStorage.getItem("ys_theme") || "light";
  } catch (_) {
    return "light";
  }
}

function initThemeToggle() {
  const btn = $("#themeToggle");

  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = getTheme();
    const next = current === "dark" ? "light" : "dark";

    setTheme(next);
  });
}

function initReveal() {
  const els = $$(".reveal");

  const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("isVisible");
          }
        });
      },
      {
        threshold: 0.15,
      }
  );

  els.forEach((el) => io.observe(el));
}

function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');

    if (!a) return;

    const target = document.querySelector(a.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

initThemeToggle();
initReveal();
initSmoothScroll();