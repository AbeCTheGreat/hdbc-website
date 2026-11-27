// ===== HDBOC TRADING CARDS =====
// One card for every character. You win them by playing the Paper Airplane Game.
// cards.html shows your collection, and game.html says "New card!" when you win one.
//
// Each card has:
//   pic   = where to cut the character out of a picture (same numbers as characters.html)
//   color = the card's border color
//   stats = three silly stats from 0 to 10
//   how   = how to win it
//   has   = checks your saved game data to see if you won it

const CARDS = [
  { id: "barry", name: "Barry", comic: "Not Smart Cops", color: "#2f55a0",
    pic: "--img: url(not-smart-cops.png); --x: 215; --y: 845; --w: 230; --h: 635;",
    stats: [["Brains", 1], ["Mustache", 10], ["Confidence", 9]],
    how: "Beat the Not Smart Cops in the game",
    has: function (d) { return (d.bosses.cops || 0) >= 1; } },
  { id: "lou", name: "Lou", comic: "Not Smart Cops", color: "#2f55a0",
    pic: "--img: url(not-smart-cops.png); --x: 590; --y: 960; --w: 330; --h: 520;",
    stats: [["Chill", 10], ["Speed", 2], ["Loot bag safety", 4]],
    how: "Beat the Not Smart Cops 3 times",
    has: function (d) { return (d.bosses.cops || 0) >= 3; } },
  { id: "antis", name: "PrayingAntis", comic: "PrayingAntis", color: "#3a8a2a",
    pic: "--img: url(praying-antis.png); --x: 290; --y: 640; --w: 520; --h: 820;",
    stats: [["Bite", 10], ["Bravery", 9], ["Fire", 8]],
    how: "Beat the PrayingAntis boss",
    has: function (d) { return (d.bosses.antis || 0) >= 1; } },
  { id: "biscuit", name: "Biscuit", comic: "PrayingAntis", color: "#3a8a2a",
    pic: "--img: url(peek-antis.png); --x: 415; --y: 425; --w: 100; --h: 80;",
    stats: [["Naps", 10], ["Bark", 7], ["Toxic glow", 8]],
    how: "Beat Biscuit the boss",
    has: function (d) { return (d.bosses.biscuit || 0) >= 1; } },
  { id: "gus", name: "Gus", comic: "Not Smart Sports", color: "#d97a1a",
    pic: "--img: url(not-smart-sports.png); --x: 355; --y: 890; --w: 240; --h: 590;",
    stats: [["Home runs", 10], ["Big dreams", 10], ["On a team", 0]],
    how: "Finish Story Mode Level 2",
    has: function (d) { return d.story >= 3; } },
  { id: "ray", name: "Ray", comic: "Not Smart Sports", color: "#d97a1a",
    pic: "--img: url(not-smart-sports.png); --x: 730; --y: 1060; --w: 230; --h: 440;",
    stats: [["Bagels", 10], ["Loyalty", 10], ["Asking nicely", 9]],
    how: "Finish Chapter 1 of Story Mode",
    has: function (d) { return d.story >= 6; } },
  { id: "max", name: "Max", comic: "The Heroes with Twisted Legs", color: "#5b2a86",
    pic: "--img: url(new-characters.png); --x: 90; --y: 10; --w: 186; --h: 420;",
    stats: [["Balance", 0], ["Courage", 8], ["Clumsy", 10]],
    how: "Finish Story Mode Level 6",
    has: function (d) { return d.story >= 7; } },
  { id: "toby", name: "Toby", comic: "The Heroes with Twisted Legs", color: "#5b2a86",
    pic: "--img: url(new-characters.png); --x: 460; --y: 40; --w: 180; --h: 400;",
    stats: [["Ideas", 9], ["GOOD ideas", 2], ["Hopping", 7]],
    how: "Finish Story Mode Level 7",
    has: function (d) { return d.story >= 8; } },
  { id: "blackout", name: "Dr. Blackout", comic: "The Heroes with Twisted Legs", color: "#5b2a86", boss: true,
    pic: "--img: url(new-characters.png); --x: 795; --y: 20; --w: 240; --h: 410;",
    stats: [["Evil", 9], ["Greed", 10], ["Hard head", 2]],
    how: "Beat Dr. Blackout",
    has: function (d) { return (d.bosses.blackout || 0) >= 1; } },
  { id: "pooant", name: "Pooant", comic: "Praying Antis 2", color: "#c9a21a",
    pic: "--img: url(new-characters.png); --x: 20; --y: 485; --w: 320; --h: 400;",
    stats: [["Poo power", 10], ["Bravery", 9], ["Smells nice", 1]],
    how: "Hit a boss with the Poo Blaster",
    has: function (d) { return !!d.badges.poo; } },
  { id: "vonbolt", name: "Baron Von Bolt", comic: "Praying Antis 2", color: "#c9a21a", boss: true,
    pic: "--img: url(new-characters.png); --x: 410; --y: 455; --w: 280; --h: 430;",
    stats: [["Lasers", 10], ["Evil laugh", 10], ["Jetpack safety", 1]],
    how: "Beat Baron Von Bolt",
    has: function (d) { return (d.bosses.vonbolt || 0) >= 1; } },
  { id: "bot", name: "Battle Bot", comic: "Praying Antis 2", color: "#c9a21a", boss: true,
    pic: "--img: url(new-characters.png); --x: 750; --y: 495; --w: 330; --h: 385;",
    stats: [["Strength", 10], ["Drill", 9], ["Brains", 3]],
    how: "Beat Battle Bot (or finish Chapter 2 of Story Mode)",
    has: function (d) { return (d.bosses.bot || 0) >= 1 || d.story >= 11; } }
];

// Reads your saved game data (it's saved in this browser)
function cardData() {
  function load(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
  }
  const stats = load("hdboc-stats", {});
  return {
    bosses: stats.bosses || {},
    story: Number(load("hdboc-story", 1)) || 1,   // 6 = finished Chapter 1, 11 = finished Chapter 2
    badges: load("hdboc-badges", {})
  };
}

// The ids of the cards you have
function ownedCards() {
  const d = cardData();
  return CARDS.filter(function (c) { return c.has(d); }).map(function (c) { return c.id; });
}

// ----- TRADING CODES -----
// Your code is a secret number that says which cards you have, like HDB-03F7.
// The last letter is a check, so a typo won't show the wrong cards.
function codeCheck(n) { return ((n * 7 + 5) % 36).toString(36).toUpperCase(); }
function cardCode(ids) {
  let n = 0;
  CARDS.forEach(function (c, i) { if (ids.indexOf(c.id) >= 0) n += Math.pow(2, i); });
  return "HDB-" + n.toString(36).toUpperCase().padStart(3, "0") + codeCheck(n);
}
// Turns a code back into a list of cards (or null if it's not a real code)
function readCardCode(code) {
  let t = String(code).toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (t.indexOf("HDB") === 0) t = t.slice(3);
  if (t.length !== 4) return null;
  const n = parseInt(t.slice(0, 3), 36);
  if (isNaN(n) || n >= Math.pow(2, CARDS.length) || codeCheck(n) !== t[3]) return null;
  return CARDS.filter(function (c, i) { return Math.floor(n / Math.pow(2, i)) % 2 === 1; })
              .map(function (c) { return c.id; });
}
