// ===== DARK MODE =====
// Every page loads this file. It remembers if you picked dark mode
// and adds the 🌙 / ☀️ button to the top bar.

// Turn dark mode on right away (before the page shows) so it doesn't flash white
try {
  if (localStorage.getItem("hdboc-theme") === "dark") {
    document.documentElement.dataset.theme = "dark";
  }
} catch (e) {}

document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("header nav");
  if (!nav) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-button";

  function show() {
    const dark = document.documentElement.dataset.theme === "dark";
    button.textContent = dark ? "☀️" : "🌙";
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    button.title = dark ? "Light mode" : "Dark mode";
  }

  button.addEventListener("click", function () {
    const dark = document.documentElement.dataset.theme !== "dark";
    if (dark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("hdboc-theme", dark ? "dark" : "light"); } catch (e) {}
    show();
  });

  show();
  nav.appendChild(button);
});
