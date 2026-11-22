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

// ===== HOLIDAY SNOW =====
// Snowflakes gently fall on every page.
//   "auto" = only from Nov 20 to Jan 10,   "on" = always,   "off" = never
const SNOW = "auto";

document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const month = now.getMonth(), day = now.getDate();   // month: 0 = January, 10 = November, 11 = December
  const snowSeason = (month === 10 && day >= 20) || month === 11 || (month === 0 && day <= 10);
  if (SNOW === "off" || (SNOW === "auto" && !snowSeason)) return;
  // Some people get dizzy from moving things, so they can turn animations off
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const snow = document.createElement("div");
  snow.className = "snow";
  snow.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 40; i++) {
    const flake = document.createElement("span");
    flake.textContent = i % 3 === 0 ? "❄" : "•";
    flake.style.left = Math.random() * 100 + "%";
    flake.style.fontSize = (i % 3 === 0 ? 10 + Math.random() * 10 : 8 + Math.random() * 8) + "px";
    flake.style.animationDuration = 8 + Math.random() * 10 + "s";   // some fall faster than others
    flake.style.animationDelay = -Math.random() * 18 + "s";          // start at different spots
    flake.style.opacity = 0.5 + Math.random() * 0.5;
    snow.appendChild(flake);
  }
  document.body.appendChild(snow);
});
