const MAX_MEAL_CALORIES = 620;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
  const scaled = cloneRecipe(meal);
  scaled.ingredients = scaled.ingredients.map((ingredient) => ({
    ...ingredient,
    amount: Math.max(0.05, roundAmount(ingredient.amount * ratio)),
  }));
  scaled.macros = macrosForMeal(scaled.ingredients);
  return scaled;
}

function capMeal(meal) {
  if (meal.macros.calories <= MAX_MEAL_CALORIES) return meal;
  const ratio = clamp((MAX_MEAL_CALORIES - 8) / meal.macros.calories, 0.72, 1);
  return scaleMeal(meal, ratio);
}

function scaleMealsToProtein(meals, foodTarget, settings) {
  const current = meals.reduce((sum, meal) => sum + meal.macros.protein, 0);
  if (!Number.isFinite(current) || current <= 0) return meals;

  const ratio = clamp(foodTarget / current, 0.72, settings.budget === "high-protein" ? 1.32 : 1.2);
  return meals.map((meal) => capMeal(scaleMeal(meal, ratio)));
}

function sumMacros(sum, meal) {
  return addMacros(sum, meal.macros);
}

function macrosForDay(meals, powderProtein) {
  const macros = meals.reduce(sumMacros, emptyMacros());
  return addMacros(macros, {
    protein: powderProtein,
    calories: powderProtein ? Math.round(powderProtein * 4.8) : 0,
    carbs: powderProtein ? 3 : 0,
    fat: powderProtein ? 1 : 0,
  });
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
    MAX_MEAL_CALORIES,
    clamp,
    roundAmount,
    cloneRecipe,
    scaleMeal,
    capMeal,
    scaleMealsToProtein,
    sumMacros,
    macrosForDay,
    averageMacros,
  };
}
