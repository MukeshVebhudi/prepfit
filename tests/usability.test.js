const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { RECIPES } = require("../recipe-data.js");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.ok(html.indexOf('id="jump-to-plan"') < html.indexOf("<fieldset>"));
assert.match(html, /Skip settings and view plan/);
assert.match(html, /id="planner-note"[^>]+role="status"[^>]+aria-atomic="true"/);
assert.match(html, /id="plan-status"[^>]+role="status"[^>]+aria-live="polite"/);
assert.doesNotMatch(html, /summary-card panel"[^>]+aria-live/);

assert.match(css, /--focus:\s*#[0-9a-f]{6}/i);
assert.match(css, /\.jump-link:not\(\[hidden\]\)[\s\S]*position:\s*sticky/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media print[\s\S]*font-size:\s*11pt/);
assert.match(css, /\.day-card \+ \.day-card[\s\S]*break-before:\s*page/);
assert.match(css, /\.grocery-category input[\s\S]*display:\s*inline-block/);

const generatedMeals = [...RECIPES.lunch, ...RECIPES.dinner];
assert.ok(generatedMeals.every((meal) => meal.steps.some((step) => /within 2 hours/.test(step))));
assert.ok(generatedMeals.filter((meal) => meal.proteinType === "chicken")
  .every((meal) => meal.steps.some((step) => /165 F/.test(step))));
assert.ok(generatedMeals.filter((meal) => meal.proteinType === "beef")
  .every((meal) => meal.steps.some((step) => /160 F/.test(step) && /145 F/.test(step))));
assert.ok(generatedMeals.filter((meal) => meal.proteinType === "fish")
  .every((meal) => meal.steps.some((step) => /145 F/.test(step))));

const elements = new Map();
const context = vm.createContext({
  console,
  document: { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, { textContent: "", innerHTML: "", dataset: {} });
    return elements.get(selector);
  } },
});
for (const file of ["nutrition-data.js", "recipe-data.js", "plan-math.js", "app.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8").replace(/^initialize\(\);$/m, ""), context);
}
vm.runInContext(`
const settings = { ...DEFAULTS, dailyTarget: 150, excluded: [], days: 7, mealMode: 'batch' };
const plan = buildPlan(settings);
renderPrepSchedule(plan, settings);
`, context);
const prep = elements.get("#prep-schedule").innerHTML;
assert.match(prep, /freeze the later portions on prep day/);
assert.match(prep, /165°F \(74°C\)/);
assert.match(prep, /USDA Leftovers and Food Safety/);

console.log("PASS: mobile plan access, accessibility markup, food safety, print, and reduced motion");
