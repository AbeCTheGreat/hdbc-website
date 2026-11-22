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

// ===== NEW COMIC COUNTDOWN =====
// When "The Heroes with Twisted Legs" comes out. Change the date here (year-month-day).
const NEW_COMIC_DATE = "2026-11-28";

document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll(".countdown");
  if (!boxes.length) return;
  const parts = NEW_COMIC_DATE.split("-").map(Number);
  const release = new Date(parts[0], parts[1] - 1, parts[2]);   // midnight at the start of that day

  function tick() {
    const left = release - new Date();   // milliseconds until it comes out
    boxes.forEach(function (box) {
      if (left <= 0) {
        box.innerHTML = '<span class="countdown-done">🎉 OUT NOW!</span>';
        return;
      }
      const s = Math.floor(left / 1000);
      const units = [
        [Math.floor(s / 86400), "days"],
        [Math.floor(s / 3600) % 24, "hours"],
        [Math.floor(s / 60) % 60, "min"],
        [s % 60, "sec"]
      ];
      box.innerHTML = units.map(function (u) {
        return '<span class="countdown-unit"><strong>' + u[0] + "</strong>" + u[1] + "</span>";
      }).join("");
    });
  }
  tick();
  setInterval(tick, 1000);
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

// ===== SECRET CODE =====
// Type H D B O C on any page (or tap the © at the bottom 5 times fast)
// and a flock of paper airplanes flies across the screen!
const SECRET_CODE = "hdboc";

function secretFlock() {
  try { localStorage.setItem("hdboc-secret", "found"); } catch (e) {}   // for the game's Secret Agent badge
  const old = document.querySelector(".secret-flock");
  if (old) return;   // the planes are already flying
  const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const message = document.createElement("div");
  message.className = "secret-message";
  message.textContent = "🤫 You found the secret code! ✈️";
  document.body.appendChild(message);
  setTimeout(function () { message.remove(); }, 4000);
  if (calm) return;   // no flying planes for people who turned animations off

  const flock = document.createElement("div");
  flock.className = "secret-flock";
  flock.setAttribute("aria-hidden", "true");
  const colors = ["#1d4e89", "#c8352a", "#2f8a46", "#f2c230", "#7a4ab8"];
  for (let i = 0; i < 14; i++) {
    const c = colors[i % colors.length];
    flock.insertAdjacentHTML("beforeend",
      '<svg viewBox="0 0 100 60"><polygon points="0,30 100,0 55,60" fill="' + c + '" stroke="#111" stroke-width="3"/>' +
      '<polygon points="100,0 40,38 55,60" fill="#ffffff" stroke="#111" stroke-width="3"/></svg>');
    const plane = flock.lastChild;
    plane.style.top = 5 + Math.random() * 80 + "%";
    plane.style.width = 40 + Math.random() * 40 + "px";
    plane.style.animationDuration = 2.5 + Math.random() * 2 + "s";
    plane.style.animationDelay = Math.random() * 1.5 + "s";
  }
  document.body.appendChild(flock);
  setTimeout(function () { flock.remove(); }, 6500);
  document.dispatchEvent(new Event("hdboc-secret"));
}

document.addEventListener("DOMContentLoaded", function () {
  // Typing the code
  let typed = "";
  document.addEventListener("keydown", function (e) {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;   // not while typing in a box
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-SECRET_CODE.length);
    if (typed === SECRET_CODE) { typed = ""; secretFlock(); }
  });

  // Tapping the © 5 times fast (for phones and tablets)
  const footer = document.querySelector("footer");
  if (!footer) return;
  let taps = 0, lastTap = 0;
  footer.addEventListener("click", function (e) {
    if (e.target.closest("a")) return;   // links still work normally
    const now = Date.now();
    taps = now - lastTap < 600 ? taps + 1 : 1;
    lastTap = now;
    if (taps >= 5) { taps = 0; secretFlock(); }
  });
});

// ===== NEW YEAR COUNTDOWN =====
// From Dec 26 to Dec 31: a countdown bar to the new year on every page.
// From Jan 1 to Jan 3: "Happy New Year!"
//   "auto" = only those days,   "on" = always,   "off" = never
const NEW_YEAR_BAR = "auto";

document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const month = now.getMonth(), day = now.getDate();
  const counting = month === 11 && day >= 26;
  const happy = month === 0 && day <= 3;
  if (NEW_YEAR_BAR === "off" || (NEW_YEAR_BAR === "auto" && !counting && !happy)) return;
  const header = document.querySelector("header");
  if (!header) return;

  const bar = document.createElement("div");
  bar.className = "new-year-bar";
  header.after(bar);

  function tick() {
    const t = new Date();
    if (t.getMonth() === 0 && t.getDate() <= 3) {
      bar.textContent = "🎆 Happy New Year " + t.getFullYear() + "! 🎆";
      return;
    }
    const next = new Date(t.getFullYear() + 1, 0, 1);   // midnight on January 1
    const s = Math.max(0, Math.floor((next - t) / 1000));
    const d = Math.floor(s / 86400), h = Math.floor(s / 3600) % 24, m = Math.floor(s / 60) % 60, sec = s % 60;
    bar.textContent = "🎆 " + (d ? d + (d === 1 ? " day, " : " days, ") : "") + h + " hr, " + m + " min, " + sec + " sec until " + next.getFullYear() + "! 🎆";
  }
  tick();
  setInterval(tick, 1000);
});
