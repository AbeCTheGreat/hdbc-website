// ===== IN STOCK? =====
// How many of each thing you have right now.
//
// TO CHANGE IT: change the word or number next to the product, then upload this file.
//   "in stock"  = you have plenty            -> shows ✅ In stock
//   3           = a number (5 or less)       -> shows ⚠️ Only 3 left!  (and people can't order more than that)
//   "sold out"  = you have none right now    -> shows ❌ Sold out      (and people can't order it)

const STOCK = {
  "Not Smart Cops":   "in stock",
  "Praying Antis":    "in stock",
  "Not Smart Sports": "in stock",
  "Original":         "in stock",
  "Looper":           "in stock",
  "Sky Fin":          "in stock",
  "Sky Fin+":         "in stock"
};

// ----- You don't need to change anything below this line -----

// Turns "in stock" / 3 / "sold out" into a label
function stockLabel(value) {
  if (value === "sold out" || value === 0) return { kind: "out", text: "❌ Sold out", max: 0 };
  if (typeof value === "number" && value <= 5) return { kind: "low", text: "⚠️ Only " + value + " left!", max: value };
  return { kind: "in", text: "✅ In stock", max: 20 };
}

document.addEventListener("DOMContentLoaded", function () {
  // 1. Product cards (on the comics and airplanes pages) have data-stock="Product name"
  document.querySelectorAll("[data-stock]").forEach(function (card) {
    const value = STOCK[card.dataset.stock];
    if (value === undefined) return;
    const label = stockLabel(value);
    const tag = document.createElement("p");
    tag.className = "stock " + label.kind;
    tag.textContent = label.text;
    const price = card.querySelector(".price");
    price.insertAdjacentElement("afterend", tag);
    if (label.kind === "out") card.classList.add("sold-out");
  });

  // 2. The order page: label each row, and stop people from ordering too many
  document.querySelectorAll(".qty").forEach(function (box) {
    const value = STOCK[box.dataset.name];
    if (value === undefined) return;
    const label = stockLabel(value);
    const tag = document.createElement("span");
    tag.className = "stock " + label.kind;
    tag.textContent = label.text;
    box.closest("tr").cells[0].append(" ", tag);
    box.max = label.max;
    if (label.kind === "out") {
      box.value = 0;
      box.disabled = true;
      box.closest("tr").classList.add("sold-out");
    }
    // If someone types more than you have, change it to the most they can get
    box.addEventListener("input", function () {
      if (Number(box.value) > label.max) {
        box.value = label.max;
        box.dispatchEvent(new Event("input"));   // add up the total again
      }
    });
  });

  // 3. The Plane Combo picks: sold-out planes and comics can't be picked
  document.querySelectorAll("#pc-comic option, .pc-plane option").forEach(function (option) {
    const names = { "Original": "Original", "Looper": "Looper", "Sky Fin": "Sky Fin", "Sky Fin+": "Sky Fin+",
                    "Not Smart Cops": "Not Smart Cops", "Praying Antis": "Praying Antis", "Not Smart Sports": "Not Smart Sports" };
    const value = STOCK[names[option.textContent]];
    if (value !== undefined && stockLabel(value).kind === "out") {
      option.disabled = true;
      option.textContent += " (sold out)";
    }
  });
});
