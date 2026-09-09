const path = require("path");
const nutrition = require(path.join(__dirname, "..", "recipe-data.js"));

Object.assign(global, nutrition);
const math = require(path.join(__dirname, "..", "plan-math.js"));

let failures = 0;
function check(name, condition, detail = "") {
  if (condition) console.log(`PASS: ${name}`);
  else {
    failures += 1;
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function approx(a, b, tolerance) {
  return Math.abs(a - b) <= tolerance;
}

function meal(name, ingredients) {
  return { name, ingredients, steps: [], macros: nutrition.macrosForMeal(ingredients) };
}

const meals = [
  meal("A", [{ name: "chicken breast", amount: 5, unit: "oz" }, { name: "rice", amount: 0.75, unit: "cup" }]),
  meal("B", [{ name: "chicken breast", amount: 5, unit: "oz" }, { name: "broccoli", amount: 1, unit: "cup" }]),
  meal("C", [{ name: "chicken breast", amount: 5, unit: "oz" }, { name: "sweet potato", amount: 1, unit: "count" }]),
];
const base = math.macrosForDay(meals, 0);

check("people and days round to integers", math.integerInRange("3.6", 1, 1, 8) === 4);
check("invalid integer input uses its fallback", math.integerInRange("oops", 5, 1, 7) === 5);
check("integer input is clamped", math.integerInRange(99, 5, 1, 7) === 7);

const weeklyBounds = math.proteinInputBounds("weekly", 5);
check("weekly protein bounds scale with prep days", weeklyBounds.min === 200 && weeklyBounds.max === 1600);
check("daily protein bounds stay fixed", math.proteinInputBounds("daily", 7).max === 320);
check("weekly goal is clamped consistently", math.normalizedProteinGoal(1900, "weekly", 5) === 1600);
check("invalid weekly goal falls back to the daily default times days", math.normalizedProteinGoal("bad", "weekly", 5) === 750);

const achievable = {
  budget: "standard", dailyTarget: base.protein * 1.2, powderProtein: 0,
  calorieGoal: 0, carbGoal: 0, fatGoal: 0,
};
const fitted = math.scaleMealsToTargets(meals, achievable);
const fittedMacros = math.macrosForDay(fitted, 0);
check(
  "an achievable protein target is fitted within tolerance",
  math.targetResults(fittedMacros, achievable)[0].kind === "near",
  `target=${achievable.dailyTarget.toFixed(1)} actual=${fittedMacros.protein.toFixed(1)}`
);
check("scaled ingredient macros remain internally consistent",
  approx(fitted[0].macros.calories, nutrition.macrosForMeal(fitted[0].ingredients).calories, 0.01));

const impossible = { ...achievable, dailyTarget: base.protein * 5 };
const impossibleMeals = math.scaleMealsToTargets(meals, impossible);
const impossibleMacros = math.macrosForDay(impossibleMeals, 0);
check("impossible high target stops at the standard 1.5x portion limit",
  impossibleMeals.every((item) => approx(item.portionRatio, 1.5, 0.001)));
check("impossible target is explicitly reported as under",
  math.targetResults(impossibleMacros, impossible)[0].kind === "under");

const multiTarget = {
  budget: "standard", dailyTarget: base.protein * 1.1, powderProtein: 0,
  calorieGoal: base.calories * 1.1, carbGoal: base.carbs * 1.1, fatGoal: base.fat * 1.1,
};
const multiMacros = math.macrosForDay(math.scaleMealsToTargets(meals, multiTarget), 0);
check("all compatible nutrition targets are fitted together",
  math.targetResults(multiMacros, multiTarget).every((result) => result.kind === "near"));

const withPowder = { ...achievable, dailyTarget: base.protein + 30, powderProtein: 30 };
const powderMeals = math.scaleMealsToTargets(meals, withPowder);
const powderMacros = math.macrosForDay(powderMeals, 30);
check("supplement protein is included during fitting and final totals",
  math.targetResults(powderMacros, withPowder)[0].kind === "near"
  && approx(powderMacros.protein, base.protein + 30, 1));
check("supplement calories are included in daily macros", powderMacros.calories > base.calories);

const excessivePowder = { ...achievable, dailyTarget: 40, powderProtein: 140 };
const lowMeals = math.scaleMealsToTargets(meals, excessivePowder);
check("food stays at the minimum portion when powder alone exceeds the target",
  lowMeals.every((item) => approx(item.portionRatio, 0.65, 0.001)));
check("over-target supplement result is exposed",
  math.targetResults(math.macrosForDay(lowMeals, 140), excessivePowder)[0].kind === "over");

const identicalDays = [{ macros: fittedMacros }, { macros: fittedMacros }];
check("average macros match identical days", approx(math.averageMacros(identicalDays).protein, fittedMacros.protein, 0.01));
check("empty plans produce zero averages", math.averageMacros([]).protein === 0);

if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll plan-math checks passed.");
