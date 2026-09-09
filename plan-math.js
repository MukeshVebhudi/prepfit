const PORTION_LIMITS = Object.freeze({
  budget: Object.freeze({ min: 0.65, max: 1.35 }),
  standard: Object.freeze({ min: 0.65, max: 1.5 }),
  "high-protein": Object.freeze({ min: 0.65, max: 1.65 }),
});

const TARGET_SPECS = Object.freeze({
  protein: Object.freeze({ minimum: 8, percent: 0.08, weight: 2, unit: "g" }),
  calories: Object.freeze({ minimum: 100, percent: 0.08, weight: 1, unit: "cal" }),
  carbs: Object.freeze({ minimum: 15, percent: 0.1, weight: 0.8, unit: "g" }),
  fat: Object.freeze({ minimum: 8, percent: 0.1, weight: 0.8, unit: "g" }),
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function integerInRange(value, fallback, min, max) {
  const parsed = Number(value);
  return clamp(Number.isFinite(parsed) ? Math.round(parsed) : fallback, min, max);
}

function proteinInputBounds(goalMode, days) {
  const safeDays = integerInRange(days, 1, 1, 7);
  return goalMode === "weekly"
    ? { min: 40 * safeDays, max: 320 * safeDays }
    : { min: 40, max: 320 };
}

function normalizedProteinGoal(value, goalMode, days, fallback = 150) {
  const bounds = proteinInputBounds(goalMode, days);
  const fallbackForMode = goalMode === "weekly" ? fallback * integerInRange(days, 1, 1, 7) : fallback;
  return clamp(Number.isFinite(Number(value)) ? Number(value) : fallbackForMode, bounds.min, bounds.max);
}

function roundAmount(value) {
  return Math.round(value * 20) / 20;
}

function cloneRecipe(recipe) {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
    steps: [...recipe.steps],
    macros: { ...recipe.macros },
  };
}

function scaleMeal(meal, ratio) {
  if (!Number.isFinite(ratio) || ratio <= 0) throw new Error("Meal scale must be positive and finite");
  const scaled = cloneRecipe(meal);
  scaled.ingredients = scaled.ingredients.map((ingredient) => ({
    ...ingredient,
    amount: Number((ingredient.amount * ratio).toFixed(6)),
  }));
  scaled.macros = macrosForMeal(scaled.ingredients);
  scaled.portionRatio = (meal.portionRatio || 1) * ratio;
  return scaled;
}

function normalizeMealPortion(meal) {
  return scaleMeal(meal, 1 / (meal.portionRatio || 1));
}

function portionLimits(settings) {
  return PORTION_LIMITS[settings.budget] || PORTION_LIMITS.standard;
}

function requestedTargets(settings) {
  const targets = { protein: settings.dailyTarget };
  if (settings.calorieGoal > 0) targets.calories = settings.calorieGoal;
  if (settings.carbGoal > 0) targets.carbs = settings.carbGoal;
  if (settings.fatGoal > 0) targets.fat = settings.fatGoal;
  return targets;
}

function targetTolerance(nutrient, target) {
  const spec = TARGET_SPECS[nutrient];
  return Math.max(spec.minimum, target * spec.percent);
}

function targetResults(actual, settings) {
  return Object.entries(requestedTargets(settings)).map(([nutrient, target]) => {
    const delta = actual[nutrient] - target;
    const tolerance = targetTolerance(nutrient, target);
    const kind = Math.abs(delta) <= tolerance ? "near" : delta < 0 ? "under" : "over";
    return { nutrient, actual: actual[nutrient], target, delta, tolerance, kind, unit: TARGET_SPECS[nutrient].unit };
  });
}

function targetFitScore(actual, settings) {
  return targetResults(actual, settings).reduce((score, result) => {
    const normalizedDelta = result.delta / result.tolerance;
    return score + TARGET_SPECS[result.nutrient].weight * normalizedDelta * normalizedDelta;
  }, 0);
}

function bestPortionRatio(meals, settings) {
  const base = meals.reduce((sum, meal) => addMacros(sum, meal.macros), emptyMacros());
  const supplement = macrosForIngredient(supplementalPowderIngredient(settings.powderProtein));
  let numerator = 0;
  let denominator = 0;

  Object.entries(requestedTargets(settings)).forEach(([nutrient, target]) => {
    const spec = TARGET_SPECS[nutrient];
    const tolerance = targetTolerance(nutrient, target);
    const weight = spec.weight / (tolerance * tolerance);
    numerator += weight * base[nutrient] * (target - supplement[nutrient]);
    denominator += weight * base[nutrient] * base[nutrient];
  });

  const ideal = denominator > 0 ? numerator / denominator : 1;
  const limits = portionLimits(settings);
  return clamp(ideal, limits.min, limits.max);
}

function scaleMealsToTargets(meals, settings) {
  const baseMeals = meals.map(normalizeMealPortion);
  const ratio = bestPortionRatio(baseMeals, settings);
  return baseMeals.map((meal) => scaleMeal(meal, ratio));
}

function sumMacros(sum, meal) {
  return addMacros(sum, meal.macros);
}

function macrosForDay(meals, powderProtein) {
  const macros = meals.reduce(sumMacros, emptyMacros());
  return addMacros(macros, macrosForIngredient(supplementalPowderIngredient(powderProtein)));
}

function averageMacros(days) {
  if (!days.length) return emptyMacros();
  const total = days.reduce((sum, day) => addMacros(sum, day.macros), emptyMacros());
  return {
    protein: total.protein / days.length,
    calories: total.calories / days.length,
    carbs: total.carbs / days.length,
    fat: total.fat / days.length,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PORTION_LIMITS, TARGET_SPECS, clamp, integerInRange, proteinInputBounds,
    normalizedProteinGoal, roundAmount, cloneRecipe, scaleMeal, normalizeMealPortion,
    portionLimits, requestedTargets, targetTolerance, targetResults, targetFitScore,
    bestPortionRatio, scaleMealsToTargets, sumMacros, macrosForDay, averageMacros,
  };
}
