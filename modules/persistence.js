import { parseJson } from "./storage.js";

export function createPersistence({ storage, schemaVersion, mealTypes, recipes, recipeEligible,
  portionLimits, cloneRecipe, ingredientGrams, macrosForMeal, macrosForDay }) {
  function storedSettings(settings) {
    const saved = { ...settings };
    delete saved.excluded;
    delete saved.dailyTarget;
    return saved;
  }

  function saveSettings(key, settings) {
    return storage.set(key, JSON.stringify(storedSettings(settings)));
  }

  function loadSettings(key, fallbackKey, defaults) {
    return { ...defaults, ...(parseJson(storage.get(key)) || parseJson(storage.get(fallbackKey)) || {}) };
  }

  function savePlanner(key, state, purchases) {
    const record = {
      schemaVersion,
      savedAt: new Date().toISOString(),
      settings: { ...state.settings, excluded: undefined },
      plan: state.plan,
      purchases: Object.fromEntries(purchases),
    };
    delete record.settings.excluded;
    return storage.set(key, JSON.stringify(record));
  }

  function loadPlanner(key) {
    const raw = storage.get(key);
    if (!raw) return { kind: "missing" };
    const record = parseJson(raw);
    if (!record || record.schemaVersion !== schemaVersion || !record.settings || !record.plan) {
      storage.remove(key);
      return { kind: "invalid", message: "Saved plan data was outdated or damaged, so PrepFit created a fresh plan." };
    }
    return { kind: "ready", record };
  }

  function validatePlan(savedPlan, settings) {
    if (!savedPlan || !Array.isArray(savedPlan.days) || !Array.isArray(savedPlan.missingTypes)) return null;
    if (savedPlan.days.length !== 0 && savedPlan.days.length !== settings.days) return null;
    try {
      const catalog = Object.values(recipes).flat();
      const days = savedPlan.days.map((savedDay, dayIndex) => {
        if (!savedDay || !Array.isArray(savedDay.meals) || savedDay.meals.length !== mealTypes.length) throw new Error("Invalid stored day");
        const meals = savedDay.meals.map((savedMeal, mealIndex) => {
          const canonical = catalog.find((recipe) => recipe.name === savedMeal?.name);
          if (!canonical || !recipeEligible(canonical, mealTypes[mealIndex], settings)) throw new Error("Unavailable stored meal");
          const limits = portionLimits(settings);
          const ratio = savedMeal.portionRatio;
          if (!Number.isFinite(ratio) || ratio < limits.min || ratio > limits.max) throw new Error("Invalid stored portion");
          if (!Array.isArray(savedMeal.ingredients) || savedMeal.ingredients.length !== canonical.ingredients.length) throw new Error("Invalid stored ingredients");
          const meal = cloneRecipe(canonical);
          meal.ingredients = savedMeal.ingredients.map((ingredient, index) => {
            const expected = canonical.ingredients[index];
            const expectedAmount = Number((expected.amount * ratio).toFixed(6));
            if (!ingredient || ingredient.name !== expected.name || !Number.isFinite(ingredient.amount)
              || ingredient.amount <= 0 || Math.abs(ingredient.amount - expectedAmount) > 0.000001) throw new Error("Invalid stored ingredient");
            ingredientGrams(ingredient);
            return { ...expected, amount: ingredient.amount };
          });
          meal.macros = macrosForMeal(meal.ingredients);
          meal.portionRatio = ratio;
          meal.label = mealTypes[mealIndex];
          return meal;
        });
        return { day: dayIndex + 1, meals, macros: macrosForDay(meals, settings.powderProtein) };
      });
      return { days, missingTypes: savedPlan.missingTypes.filter((type) => mealTypes.includes(type)),
        ...(typeof savedPlan.conflict === "string" ? { conflict: savedPlan.conflict } : {}) };
    } catch (error) {
      return null;
    }
  }

  return { loadPlanner, loadSettings, savePlanner, saveSettings, validatePlan };
}
