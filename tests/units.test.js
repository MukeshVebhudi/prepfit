const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sources = ["modules/utils.js", "modules/units.js", "modules/groceries.js"]
  .map((file) =>
    fs
      .readFileSync(path.join(__dirname, "..", file), "utf8")
      .replace(/^import.*\n/gm, "")
      .replace(/^export\s+/gm, ""),
  )
  .join("\n");
const context = { console };
vm.createContext(context);
vm.runInContext(
  `${sources}\nthis.api = { createGroceryTools, displayMass, loadUnitSystem, saveUnitSystem };`,
  context,
);

const values = new Map();
const storage = {
  get: (key) => values.get(key) ?? null,
  set: (key, value) => {
    values.set(key, value);
    return true;
  },
};
assert.equal(context.api.loadUnitSystem(storage, "units"), "metric");
assert.equal(context.api.saveUnitSystem(storage, "units", "imperial"), true);
assert.equal(values.get("units"), "imperial");
assert.equal(context.api.loadUnitSystem(storage, "units"), "imperial");

let mode = "metric";
const tools = context.api.createGroceryTools({
  categories: ["Protein"],
  categoryByIngredient: { chicken: "Protein" },
  nutrition: { chicken: { preparation: "cooked" } },
  ingredientGrams: (item) => (item.unit === "cup" ? item.amount * 140 : item.amount),
  nutritionUnit: (unit) => unit,
  supplementalPowderIngredient: () => null,
  getUnitSystem: () => mode,
});
const weighted = { name: "chicken", amount: 500, unit: "g" };
assert.match(tools.formatIngredient(weighted, 1), /^500 g chicken/);
assert.match(tools.groceryText([{ ...weighted, category: "Protein" }]), /500 g chicken/);
mode = "imperial";
assert.match(tools.formatIngredient(weighted, 1), /^1\.1 lb chicken/);
assert.match(tools.formatIngredient({ name: "chicken", amount: 1, unit: "cup" }, 1), /4\.94 oz/);
assert.match(tools.groceryText([{ ...weighted, category: "Protein" }]), /1\.1 lb chicken/);

console.log("Unit preference and conversion tests passed.");
