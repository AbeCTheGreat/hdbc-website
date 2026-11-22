// ===== HDBOC LEADERBOARD =====
// Scores are sent to a Google Form. The form puts them in a Google Sheet,
// and the leaderboard page reads that sheet.
//
// TO REMOVE A SILLY NAME: open the leaderboard's Google Sheet and delete that row.

const LEADERBOARD = {
  // Where scores get sent (the Google Form)
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd1ACiDM76S3hJSuqRD7F1jF_ROW5i01341nuLTAoXAF4NsSw/formResponse",
  nicknameBox: "entry.1555318042",   // the secret ID of the "Nickname" question
  scoreBox: "entry.1536123389",    // the secret ID of the "Score" question
  planeBox: "entry.1884007471",    // the secret ID of the "Plane" question
  // Where the leaderboard page reads the scores from (the published Google Sheet)
  sheetUrl: ""
};

// Words that aren't allowed in nicknames (add more if you need to)
const NOT_ALLOWED = ["poop", "butt", "stupid", "dumb", "idiot", "hate", "kill", "fart", "sucks", "loser"];

// ----- You don't need to change anything below this line -----

function leaderboardReady() {
  return LEADERBOARD.formUrl !== "" && LEADERBOARD.sheetUrl !== "";
}

// Cleans up a nickname: only letters, numbers, and spaces, 12 letters max.
// Gives back "" if it's not allowed.
function cleanNickname(name) {
  const clean = String(name).replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 12);
  const lower = clean.toLowerCase().replace(/ /g, "");
  if (NOT_ALLOWED.some(function (word) { return lower.includes(word); })) return "";
  return clean;
}

// Sends one score to the Google Form
function sendScore(nickname, score, plane) {
  const data = new URLSearchParams();
  data.append(LEADERBOARD.nicknameBox, nickname);
  data.append(LEADERBOARD.scoreBox, String(score));
  data.append(LEADERBOARD.planeBox, plane);
  // "no-cors" means we can't read Google's answer, but the score still gets saved
  return fetch(LEADERBOARD.formUrl, { method: "POST", mode: "no-cors", body: data });
}

// Reads the sheet and gives back the best score for each nickname, highest first
function loadScores() {
  return fetch(LEADERBOARD.sheetUrl + "&t=" + Date.now())   // the &t= part makes sure we get the newest version
    .then(function (r) { return r.text(); })
    .then(function (csv) {
      const rows = parseCSV(csv).slice(1);   // skip the title row
      const best = {};
      rows.forEach(function (row) {
        // the sheet's columns: Timestamp, Nickname, Score, Plane
        const name = cleanNickname(row[1] || "");
        const score = Math.floor(Number(row[2]));
        if (!name || !(score > 0) || score > 2000) return;   // skip empty, bad, or impossible scores
        const key = name.toLowerCase();
        if (!best[key] || score > best[key].score) best[key] = { name: name, score: score, plane: row[3] || "" };
      });
      return Object.keys(best).map(function (k) { return best[k]; })
        .sort(function (a, b) { return b.score - a.score; });
    });
}

// Turns spreadsheet text (CSV) into rows and columns
function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
