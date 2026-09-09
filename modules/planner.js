import { listWords, seededNoise } from "./utils.js";

export function createPlanner({ recipes, mealTypes, ingredientTags, cloneRecipe,
  scaleMealsToTargets, macrosForDay, targetFitScore, supplementalPowderIngredient,
  averageMacros, portionLimits, targetResults, getFavorites }) {
  function recipeEligible(recipe, type, settings) {
    const cuisineMatch = settings.cuisine === "random" || recipe.cuisine === settings.cuisine || type === "Breakfast";
    const proteinMatch = settings.meat === "vegetarian"
      ? recipe.proteinType === "vegetarian" && !recipe.ingredients.some((ingredient) =>
        (ingredientTags[ingredient.name] || []).some((tag) => tag === "meat" || tag === "fish"))
      : type === "Breakfast" || recipe.proteinType === settings.meat;
    const avoids = settings.excluded.some((term) => recipe.ingredients.some((ingredient) =>
      ingredient.name.toLowerCase().includes(term) || (ingredient.componentOf || "").includes(term)
      || (ingredientTags[ingredient.name] || []).includes(term)));
    return cuisineMatch && proteinMatch && !avoids;
  }

  function recipeCandidates(type, settings) {
    return recipes[type.toLowerCase()].filter((recipe) => recipeEligible(recipe, type, settings));
  }

  function recipeScore(recipe, type, settings, usedNames, seed, index) {
    let score = index * 0.5 + seededNoise(recipe.name, seed) * 14;
    if (usedNames.has(recipe.name)) score += 240;
    if (getFavorites().has(recipe.name)) score -= 55;
    if (settings.budget === "budget") score += recipe.cost * 20;
    if (settings.budget === "high-protein") score -= recipe.macros.protein * 1.8;
    if (type === "Breakfast" && recipe.cuisine === "classic") score -= 6;
    return score;
  }

  function shortlistCandidates(type, candidates, settings, usedNames, seed) {
    const foodProtein = Math.max(0, settings.dailyTarget - settings.powderProtein) / 3;
    return [...candidates].sort((a, b) => {
      const score = (recipe) => {
        let value = recipeScore(recipe, type, settings, usedNames, seed, 0);
        value += Math.abs(recipe.macros.protein - foodProtein) * 2;
        if (settings.calorieGoal) value += Math.abs(recipe.macros.calories - settings.calorieGoal / 3) * 0.12;
        if (settings.carbGoal) value += Math.abs(recipe.macros.carbs - settings.carbGoal / 3) * 0.2;
        if (settings.fatGoal) value += Math.abs(recipe.macros.fat - settings.fatGoal / 3) * 0.35;
        return value;
      };
      return score(a) - score(b);
    }).slice(0, 10);
  }

  function selectDayMeals(settings, usedNames, seed = 0) {
    const candidates = mealTypes.map((type) =>
      shortlistCandidates(type, recipeCandidates(type, settings), settings, usedNames, seed));
    let best = null;
    candidates[0].forEach((breakfast) => candidates[1].forEach((lunch) => candidates[2].forEach((dinner) => {
      const rawMeals = [breakfast, lunch, dinner].map(cloneRecipe);
      const meals = scaleMealsToTargets(rawMeals, settings);
      const actual = macrosForDay(meals, settings.powderProtein);
      const preference = rawMeals.reduce((sum, meal, index) =>
        sum + recipeScore(meal, mealTypes[index], settings, usedNames, seed, index), 0);
      const score = targetFitScore(actual, settings) * 100 + preference;
      if (!best || score < best.score) best = { score, meals };
    })));
    return { meals: best.meals };
  }

  function makeDay(day, selected, settings) {
    const meals = selected.meals.map((meal, index) => ({ ...meal, label: mealTypes[index] }));
    return { day, meals, macros: macrosForDay(meals, settings.powderProtein) };
  }

  function buildPlan(settings, options = {}) {
    const usedNames = new Set();
    const days = [];
    const seed = options.shuffle ? Math.random() : 0;
    if (settings.powderProtein && !recipeEligible({
      proteinType: "vegetarian", ingredients: [supplementalPowderIngredient(settings.powderProtein)],
    }, "Breakfast", settings)) {
      return { days, missingTypes: [], conflict: "The supplemental whey powder conflicts with your avoided ingredients. Set supplemental protein to zero or change the exclusion; restrictions have not been relaxed." };
    }
    const missingTypes = mealTypes.filter((type) => !recipeCandidates(type, settings).length);
    if (missingTypes.length) return { days, missingTypes };
    const batch = settings.mealMode === "batch" ? selectDayMeals(settings, usedNames, seed) : null;
    for (let day = 1; day <= settings.days; day += 1) {
      const selected = batch || selectDayMeals(settings, usedNames, seed + day);
      selected.meals.forEach((meal) => usedNames.add(meal.name));
      days.push(makeDay(day, selected, settings));
    }
    return { days, missingTypes: [] };
  }

  function nutritionTargetLabel(nutrient) {
    return { protein: "Protein", calories: "Calories", carbs: "Carbs", fat: "Fat" }[nutrient];
  }

  function formatTargetDelta(result) {
    if (result.kind === "near") return `${Math.abs(Math.round(result.delta))}${result.unit} from target`;
    return `${Math.abs(Math.round(result.delta))}${result.unit} ${result.kind}`;
  }

  function buildWarning(plan, settings, averages = averageMacros(plan.days)) {
    const warnings = [];
    if (plan.conflict) return plan.conflict;
    if (plan.missingTypes?.length) {
      return `No matching ${listWords(plan.missingTypes.map((type) => type.toLowerCase()))} recipes for your protein choice, cuisine, and avoided ingredients. Change your filters to create a complete plan. Restrictions have not been relaxed.`;
    }
    const limits = portionLimits(settings);
    const outside = targetResults(averages, settings).filter((result) => result.kind !== "near");
    if (settings.powderProtein > settings.dailyTarget) warnings.push("Supplemental whey alone exceeds the protein target; food portions stay at the minimum.");
    if (outside.length) {
      const details = outside.map((result) =>
        `${nutritionTargetLabel(result.nutrient).toLowerCase()} is ${formatTargetDelta(result)}`).join(", ");
      warnings.push(`Closest plan within ${limits.min}×–${limits.max}× portion limits: ${details}.`);
    }
    return warnings.join(" ");
  }

  return { buildPlan, buildWarning, formatTargetDelta, nutritionTargetLabel, recipeCandidates, recipeEligible, recipeScore };
}
