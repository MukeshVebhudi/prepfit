const path = require("path");

const { macrosForMeal, addMacros, emptyMacros } = require(path.join(__dirname, "..", "recipe-data.js"));

// plan-math.js is a classic script in the browser and relies on macrosForMeal/addMacros/emptyMacros
// being globals loaded before it (from recipe-data.js). Mirror that here for the Node test.
global.macrosForMeal = macrosForMeal;
global.addMacros = addMacros;
global.emptyMacros = emptyMacros;

const {
  MAX_MEAL_CALORIES,
  clamp,
  scaleMeal,
  capMeal,
  scaleMealsToProtein,
  sumMacros,
  macrosForDay,
  averageMacros,
} = require(path.join(__dirname, "..", "plan-math.js"));

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log(`PASS: ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function approx(a, b, tolerance) {
  return Math.abs(a - b) <= tolerance;
}

function meal(name, ingredients) {
  return { name, ingredients, steps: [], macros: macrosForMeal(ingredients) };
}

// --- clamp ---

check(
  "clamp keeps values within [min, max]",
  clamp(5, 0, 10) === 5 && clamp(-5, 0, 10) === 0 && clamp(15, 0, 10) === 10
);

// --- scaleMeal recomputes macros from the scaled ingredients, not just multiplying old numbers ---

const chickenBowl = meal("Test Chicken Bowl", [
  { name: "chicken breast", amount: 6, unit: "oz" },
  { name: "brown rice", amount: 0.75, unit: "cup" },
  { name: "broccoli", amount: 1.5, unit: "cup" },
]);
const scaledUp = scaleMeal(chickenBowl, 1.2);
const recomputed = macrosForMeal(scaledUp.ingredients);

check(
  "scaleMeal's reported macros match macrosForMeal on its own scaled ingredients",
  approx(scaledUp.macros.protein, recomputed.protein, 0.01) && approx(scaledUp.macros.calories, recomputed.calories, 0.01),
  `scaled=${JSON.stringify(scaledUp.macros)} recomputed=${JSON.stringify(recomputed)}`
);

check(
  "scaleMeal actually raises protein when ratio > 1",
  scaledUp.macros.protein > chickenBowl.macros.protein,
  `before=${chickenBowl.macros.protein} after=${scaledUp.macros.protein}`
);

// --- capMeal never raises calories, and brings a moderately-over meal near the ceiling ---

const bigMeal = meal("Big Test Plate", [
  { name: "chicken breast", amount: 8, unit: "oz" },
  { name: "brown rice", amount: 1, unit: "cup" },
  { name: "broccoli", amount: 1, unit: "cup" },
]);

check(
  "fixture meal is over the cap but within the 0.72x-1x scaling window (so this checks the normal case, not the floor)",
  bigMeal.macros.calories > MAX_MEAL_CALORIES && (MAX_MEAL_CALORIES - 8) / bigMeal.macros.calories >= 0.72,
  `calories=${bigMeal.macros.calories} requiredRatio=${((MAX_MEAL_CALORIES - 8) / bigMeal.macros.calories).toFixed(3)}`
);

const capped = capMeal(bigMeal);

check("capMeal never raises calories", capped.macros.calories <= bigMeal.macros.calories);

check(
  "capMeal brings a moderately-over meal at or under the calorie ceiling",
  capped.macros.calories <= MAX_MEAL_CALORIES + 1,
  `capped=${capped.macros.calories} ceiling=${MAX_MEAL_CALORIES}`
);

// --- capMeal on an extremely dense meal: its scale-down floors at 0.72x, so the cap can legitimately fail ---

const extremeMeal = meal("Extreme Test Plate", [
  { name: "sirloin steak", amount: 20, unit: "oz" },
  { name: "naan", amount: 3, unit: "count" },
  { name: "olive oil", amount: 4, unit: "tbsp" },
]);
const extremeCapped = capMeal(extremeMeal);

check(
  "capMeal never scales an extreme meal below its 0.72x floor, even if it stays over the cap",
  extremeCapped.macros.calories >= extremeMeal.macros.calories * 0.72 - 5,
  `extreme=${extremeMeal.macros.calories} capped=${extremeCapped.macros.calories}`
);

// --- scaleMealsToProtein moves total protein toward an in-range target ---

const threeMeals = [
  meal("A", [{ name: "chicken breast", amount: 5, unit: "oz" }, { name: "rice", amount: 0.75, unit: "cup" }]),
  meal("B", [{ name: "chicken breast", amount: 5, unit: "oz" }, { name: "broccoli", amount: 1, unit: "cup" }]),
  meal("C", [{ name: "chicken breast", amount: 5, unit: "oz" }, { name: "sweet potato", amount: 1, unit: "count" }]),
];
const originalProtein = threeMeals.reduce((sum, m) => sum + m.macros.protein, 0);

const inRangeTarget = originalProtein * 1.15; // inside the 0.72x-1.2x clamp window
const scaledMeals = scaleMealsToProtein(threeMeals, inRangeTarget, { budget: "standard" });
const scaledProtein = scaledMeals.reduce((sum, m) => sum + m.macros.protein, 0);

check(
  "scaleMealsToProtein moves total protein toward an in-range target",
  approx(scaledProtein, inRangeTarget, inRangeTarget * 0.05),
  `target=${inRangeTarget.toFixed(1)} actual=${scaledProtein.toFixed(1)} original=${originalProtein.toFixed(1)}`
);

const wildTarget = originalProtein * 5;
const wildScaled = scaleMealsToProtein(threeMeals, wildTarget, { budget: "standard" });
const wildProtein = wildScaled.reduce((sum, m) => sum + m.macros.protein, 0);

check(
  "scaleMealsToProtein clamps to its 1.2x ceiling instead of chasing an unreachable target",
  wildProtein <= originalProtein * 1.2 + 1,
  `ceiling=${(originalProtein * 1.2).toFixed(1)} actual=${wildProtein.toFixed(1)}`
);

const highProteinScaled = scaleMealsToProtein(threeMeals, wildTarget, { budget: "high-protein" });
const highProteinTotal = highProteinScaled.reduce((sum, m) => sum + m.macros.protein, 0);

check(
  "high-protein budget mode allows scaling past the standard 1.2x ceiling (up to 1.32x)",
  highProteinTotal > originalProtein * 1.2,
  `1.2x=${(originalProtein * 1.2).toFixed(1)} actual=${highProteinTotal.toFixed(1)}`
);

// --- macrosForDay / sumMacros / averageMacros aggregate correctly ---

const dayMacros = macrosForDay(threeMeals, 30);
const mealsOnly = threeMeals.reduce(sumMacros, emptyMacros());

check(
  "macrosForDay adds the powder-protein grams on top of meal protein",
  approx(dayMacros.protein, mealsOnly.protein + 30, 0.01),
  `mealsOnly=${mealsOnly.protein} withPowder=${dayMacros.protein}`
);

const identicalDays = [{ macros: macrosForDay(threeMeals, 0) }, { macros: macrosForDay(threeMeals, 0) }];
const avg = averageMacros(identicalDays);

check(
  "averageMacros matches a single day's macros when every day is identical",
  approx(avg.protein, identicalDays[0].macros.protein, 0.01),
  `perDay=${identicalDays[0].macros.protein} avg=${avg.protein}`
);

check("averageMacros of zero days returns zeroed macros, not NaN", averageMacros([]).protein === 0);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}

console.log("\nAll plan-math checks passed.");
