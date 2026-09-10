const PROTEINS = {
  chicken: { label: "Chicken", source: "chicken breast", cost: 2 },
  beef: { label: "Beef", source: "lean beef", cost: 4 },
  turkey: { label: "Turkey", source: "lean turkey", cost: 2 },
  fish: { label: "Fish", source: "salmon or tuna", cost: 4 },
  vegetarian: { label: "Vegetarian", source: "tofu, legumes, dairy", cost: 1 },
};

const CATEGORY_BY_INGREDIENT = {
  cabbage: "Produce", carrots: "Produce", cucumber: "Produce",
  "black pepper": "Spices", paprika: "Spices", cumin: "Spices", coriander: "Spices",
  "garlic powder": "Spices", dill: "Spices", salt: "Spices",
  "chicken breast": "Protein",
  "lean ground beef": "Protein",
  "sirloin steak": "Protein",
  "lean ground turkey": "Protein",
  "salmon fillet": "Protein",
  "canned tuna": "Protein",
  "extra firm tofu": "Protein",
  "tempeh": "Protein",
  "paneer cheese": "Protein",
  "egg whites": "Protein",
  "whole eggs": "Protein",
  "turkey slices": "Protein",
  edamame: "Frozen",
  broccoli: "Produce",
  spinach: "Produce",
  zucchini: "Produce",
  asparagus: "Produce",
  "green beans": "Produce",
  "bell peppers": "Produce",
  onion: "Produce",
  lemon: "Produce",
  avocado: "Produce",
  "sweet potato": "Produce",
  "baby potatoes": "Produce",
  "fajita vegetables": "Frozen",
  "stir fry vegetables": "Frozen",
  "snap peas": "Produce",
  "romaine lettuce": "Produce",
  "slaw mix": "Produce",
  corn: "Frozen",
  rice: "Grains",
  "brown rice": "Grains",
  "basmati rice": "Grains",
  quinoa: "Grains",
  farro: "Grains",
  couscous: "Grains",
  "protein pasta": "Grains",
  pita: "Grains",
  naan: "Grains",
  "whole grain bread": "Grains",
  oats: "Grains",
  "rolled oats": "Grains",
  "black beans": "Pantry",
  "pinto beans": "Pantry",
  "kidney beans": "Pantry",
  chickpeas: "Pantry",
  lentils: "Pantry",
  peas: "Frozen",
  salsa: "Pantry",
  "marinara sauce": "Pantry",
  "tomato sauce": "Pantry",
  "crushed tomatoes": "Pantry",
  "teriyaki sauce": "Pantry",
  "soy sauce": "Pantry",
  "barbecue sauce": "Pantry",
  "tikka masala sauce": "Pantry",
  "curry simmer sauce": "Pantry",
  "cauliflower rice": "Frozen",
  hummus: "Pantry",
  "olive oil": "Pantry",
  garlic: "Produce",
  "taco seasoning": "Spices",
  "chili seasoning": "Spices",
  "steak seasoning": "Spices",
  "masala spices": "Spices",
  ginger: "Produce",
  "plain Greek yogurt": "Dairy",
  "Greek yogurt": "Dairy",
  "cottage cheese": "Dairy",
  "shredded cheese": "Dairy",
  "mozzarella cheese": "Dairy",
  "parmesan cheese": "Dairy",
  "Alfredo sauce": "Dairy",
  "coconut cream": "Pantry",
  "whey protein powder": "Pantry",
  blueberries: "Produce",
  "peanut butter": "Pantry",
  tzatziki: "Dairy",
  "yogurt sauce": "Dairy",
};

// Explicit dietary categories for the ingredient library, not brand/allergen certification.
const INGREDIENT_TAGS = {
  ...Object.fromEntries([
    "chicken breast", "lean ground beef", "sirloin steak", "lean ground turkey", "turkey slices",
  ].map((name) => [name, ["meat"]])),
  ...Object.fromEntries(["salmon fillet", "canned tuna"].map((name) => [name, ["fish"]])),
  ...Object.fromEntries([
    "paneer cheese", "plain Greek yogurt", "Greek yogurt", "cottage cheese", "whey protein powder",
    "shredded cheese", "mozzarella cheese", "parmesan cheese", "Alfredo sauce",
    "tzatziki", "yogurt sauce", "tikka masala sauce",
  ].map((name) => [name, ["dairy"]])),
  ...Object.fromEntries(["whole eggs", "egg whites"].map((name) => [name, ["eggs"]])),
  ...Object.fromEntries([
    "black beans", "pinto beans", "kidney beans", "chickpeas", "lentils", "edamame",
    "extra firm tofu", "tempeh", "hummus", "peanut butter", "protein pasta", "soy sauce",
  ].map((name) => [name, ["legumes"]])),
  "Alfredo sauce": ["dairy", "eggs", "legumes"],
};

const NUTRITION = typeof module !== "undefined" && module.exports
  ? require("./nutrition-data.js") : NUTRITION_DATA;

// These are explicit PrepFit recipes, not estimates for unspecified packaged mixes.
// Each unit below scales a recipe portion; it does not assert the final mixture's volume.
const INGREDIENT_BLENDS = {
  "slaw mix": { unit: "cup", components: [["cabbage", 56], ["carrots", 22]] },
  "fajita vegetables": { unit: "cup", components: [["bell peppers", 74.5], ["onion", 80]] },
  "stir fry vegetables": { unit: "cup", components: [["broccoli", 45.5], ["carrots", 27.5], ["bell peppers", 37.25]] },
  "tzatziki": { unit: "tbsp", components: [["plain Greek yogurt", 10], ["cucumber", 4], ["lemon", 0.5], ["garlic", 0.25], ["dill", 0.05]] },
  "yogurt sauce": { unit: "tbsp", components: [["plain Greek yogurt", 12], ["lemon", 2], ["garlic", 0.25]] },
  "steak seasoning": { unit: "tsp", components: [["garlic powder", 0.5], ["black pepper", 0.5], ["paprika", 0.5], ["salt", 0.5]] },
  "masala spices": { unit: "tsp", components: [["cumin", 0.6], ["coriander", 0.6], ["paprika", 0.6], ["black pepper", 0.2]] },
};

const MASS_IN_GRAMS = { g: 1, kg: 1000, oz: 28.349523125, lb: 453.59237 };
// US customary measures, consistent throughout; fluid ounces are volume, ounces are mass.
const VOLUME_IN_TSP = { tsp: 1, tbsp: 3, cup: 48, "fl oz": 6, ml: 48 / 236.5882365, l: 48000 / 236.5882365 };

function nutritionUnit(unit) {
  const value = String(unit || "").trim().toLowerCase();
  return { grams: "g", gram: "g", kilograms: "kg", ounces: "oz", ounce: "oz",
    pounds: "lb", pound: "lb", cups: "cup", tablespoons: "tbsp", tablespoon: "tbsp",
    teaspoons: "tsp", teaspoon: "tsp", cloves: "clove", slices: "slice",
    cans: "can", scoops: "scoop", milliliters: "ml", liters: "l" }[value] || value;
}

function sameDimensionRatio(from, to) {
  if (from === to) return 1;
  for (const measures of [MASS_IN_GRAMS, VOLUME_IN_TSP]) {
    if (Object.hasOwn(measures, from) && Object.hasOwn(measures, to)) return measures[from] / measures[to];
  }
  throw new Error(`Cannot convert ${from} to ${to} without an ingredient-specific reference.`);
}

function ingredientGrams(ingredient) {
  const reference = Object.hasOwn(NUTRITION, ingredient.name) && NUTRITION[ingredient.name];
  if (!reference) throw new Error(`Missing nutrition reference: ${ingredient.name}`);
  if (!Number.isFinite(ingredient.amount) || ingredient.amount < 0) {
    throw new Error(`Invalid ingredient amount: ${ingredient.name}`);
  }
  if (ingredient.preparation && ingredient.preparation !== reference.preparation) {
    throw new Error(`Preparation mismatch for ${ingredient.name}: expected ${reference.preparation}`);
  }
  const unit = nutritionUnit(ingredient.unit);
  if (Object.hasOwn(MASS_IN_GRAMS, unit)) return ingredient.amount * MASS_IN_GRAMS[unit];
  if (Object.hasOwn(reference.gramsPerUnit, unit)) return ingredient.amount * reference.gramsPerUnit[unit];
  if (Object.hasOwn(VOLUME_IN_TSP, unit)) {
    const basis = Object.keys(reference.gramsPerUnit).find((key) => Object.hasOwn(VOLUME_IN_TSP, key));
    if (basis) return ingredient.amount * sameDimensionRatio(unit, basis) * reference.gramsPerUnit[basis];
  }
  throw new Error(`Unsupported unit "${ingredient.unit}" for ${ingredient.name}. Use grams or a documented portion.`);
}

function expandIngredient(ingredient) {
  const blend = INGREDIENT_BLENDS[ingredient.name];
  if (!blend) return [{ ...ingredient, preparation: NUTRITION[ingredient.name]?.preparation }];
  const ratio = ingredient.amount * sameDimensionRatio(nutritionUnit(ingredient.unit), blend.unit);
  return blend.components.map(([name, grams]) => ({
    name, amount: grams * ratio, unit: "g", preparation: NUTRITION[name].preparation,
    componentOf: ingredient.name,
  }));
}

function validateRecipeIngredients(recipes) {
  const missingMacros = new Set();
  const missingCategory = new Set();
  const duplicateIds = new Set();
  const invalidFields = new Set();
  const invalidUnits = new Set();
  const invalidNutrition = new Set();
  const seenIds = new Set();

  Object.values(recipes).flat().forEach((recipe) => {
    if (!recipe.id || seenIds.has(recipe.id)) duplicateIds.add(recipe.id || "(missing)");
    seenIds.add(recipe.id);
    if (!recipe.name || !recipe.label || !recipe.cuisine || !recipe.proteinType
      || !Array.isArray(recipe.steps) || recipe.steps.length < 3
      || recipe.steps.some((step) => typeof step !== "string" || !step.trim())
      || !Array.isArray(recipe.ingredients) || !recipe.ingredients.length
      || !Array.isArray(recipe.allergens)) invalidFields.add(recipe.name || recipe.id || "(unnamed)");
    if (!recipe.macros || Object.values(recipe.macros).some((value) => !Number.isFinite(value) || value < 0)
      || recipe.macros.protein > 200 || recipe.macros.calories > 2500
      || recipe.macros.carbs > 400 || recipe.macros.fat > 200) invalidNutrition.add(recipe.name || recipe.id);
    recipe.ingredients.forEach((ingredient) => {
      if (!NUTRITION[ingredient.name]) missingMacros.add(ingredient.name);
      if (!CATEGORY_BY_INGREDIENT[ingredient.name]) missingCategory.add(ingredient.name);
      try { ingredientGrams(ingredient); } catch (error) { invalidUnits.add(`${recipe.name}: ${ingredient.name}/${ingredient.unit}`); }
    });
  });

  return {
    missingMacros: [...missingMacros], missingCategory: [...missingCategory],
    duplicateIds: [...duplicateIds], invalidFields: [...invalidFields],
    invalidUnits: [...invalidUnits], invalidNutrition: [...invalidNutrition],
  };
}

function buildRecipeLibrary() {
  const breakfast = [
    recipe("Breakfast", "classic", "vegetarian", "Greek Yogurt Power Oats", [
      item("plain Greek yogurt", 240, "g"),
      item("rolled oats", 0.5, "cup"),
      item("whey protein powder", 16, "g"),
      item("blueberries", 0.5, "cup"),
      item("peanut butter", 1, "tbsp"),
    ], ["Weigh the yogurt and dry oats and powder as listed, then stir together.", "Top with blueberries and peanut butter.", "Chill overnight or portion immediately."], 1),
    recipe("Breakfast", "classic", "turkey", "Egg White Turkey Scramble", [
      item("egg whites", 1, "cup"),
      item("whole eggs", 1, "count"),
      item("turkey slices", 3, "oz"),
      item("spinach", 1, "cup"),
      item("shredded cheese", 0.15, "cup"),
    ], ["Warm the ready-to-eat turkey and wilt the raw spinach in a nonstick skillet with a splash of water.", "Add the raw eggs and egg whites, scramble until set, then stir in the listed cheese.", "Cool before packing."], 2),
    recipe("Breakfast", "classic", "vegetarian", "Cottage Cheese Egg Toast", [
      item("cottage cheese", 0.75, "cup"),
      item("whole eggs", 2, "count"),
      item("whole grain bread", 2, "slices"),
      item("avocado", 0.25, "count"),
    ], ["Toast bread and cook eggs.", "Spread cottage cheese over toast.", "Pack avocado separately and add after reheating."], 2),
    recipe("Breakfast", "classic", "vegetarian", "Paneer Spinach Breakfast Bowl", [
      item("paneer cheese", 3.5, "oz"),
      item("whole eggs", 1, "count"),
      item("spinach", 1.5, "cups"),
      item("baby potatoes", 4, "oz"),
      item("masala spices", 1, "tsp"),
    ], ["Weigh potatoes raw, combine the listed masala spice components, and roast on parchment at 425 F until tender.", "Sear paneer in a nonstick skillet and wilt spinach with a splash of water; no unlisted oil is included.", "Top with a cooked egg before portioning."], 3),
    recipe("Breakfast", "american", "vegetarian", "Blueberry Cottage Cheese Toast", [
      item("cottage cheese", 1, "cup"), item("whole grain bread", 2, "slices"),
      item("blueberries", 0.75, "cup"), item("peanut butter", 1, "tbsp"),
    ], ["Toast the bread until crisp.", "Spread cottage cheese and the measured peanut butter across the toast.", "Pack blueberries separately and add immediately before serving."], 2),
    recipe("Breakfast", "american", "chicken", "Chicken Sweet Potato Breakfast Hash", [
      item("chicken breast", 4.5, "oz"), item("sweet potato", 1, "count"),
      item("bell peppers", 1, "cup"), item("spinach", 1, "cup"), item("paprika", 1, "tsp"),
    ], ["Cook chicken without extra oil to 165 F, rest it, and weigh the cooked portion.", "Dice the raw sweet potato and pepper; roast on parchment at 425 F until tender.", "Wilt spinach with water, season with paprika, combine, and cool in shallow containers within 2 hours."], 2),
    recipe("Breakfast", "mexican", "beef", "Beef Black Bean Breakfast Bowl", [
      item("lean ground beef", 4, "oz"), item("black beans", 0.65, "cup"),
      item("whole eggs", 1, "count"), item("salsa", 0.25, "cup"), item("spinach", 1, "cup"),
    ], ["Cook ground beef to 160 F and the egg until set, using a food thermometer for the beef.", "Warm cooked drained beans and wilt spinach with a splash of water.", "Portion with salsa on the side and refrigerate or freeze within 2 hours."], 3),
    recipe("Breakfast", "mediterranean", "turkey", "Turkey Hummus Breakfast Pita", [
      item("turkey slices", 4, "oz"), item("pita", 1, "count"), item("hummus", 3, "tbsp"),
      item("cucumber", 1, "cup"), item("spinach", 1, "cup"),
    ], ["Warm the ready-to-eat turkey and pita separately.", "Wash and dry cucumber and spinach, then keep them cold.", "Pack hummus and vegetables separately; assemble after reheating the turkey and pita."], 2),
    recipe("Breakfast", "asian", "fish", "Salmon Edamame Breakfast Rice", [
      item("salmon fillet", 4.5, "oz"), item("brown rice", 0.75, "cup"),
      item("edamame", 0.5, "cup"), item("spinach", 1.5, "cups"), item("soy sauce", 1, "tbsp"),
    ], ["Cook salmon to 145 F and weigh the cooked edible portion.", "Cook brown rice in water and measure it cooked; warm edamame and wilt spinach.", "Add measured soy sauce, portion into shallow containers, and refrigerate or freeze within 2 hours."], 4),
    recipe("Breakfast", "asian", "vegetarian", "Savory Tofu Quinoa Breakfast Bowl", [
      item("extra firm tofu", 7, "oz"), item("quinoa", 0.7, "cup"),
      item("spinach", 1.5, "cups"), item("snap peas", 1, "cup"), item("ginger", 1, "tbsp"),
    ], ["Drain and weigh tofu, then brown it in a nonstick pan with a splash of water.", "Cook quinoa in water and measure it cooked; steam snap peas and wilt spinach.", "Stir in measured ginger, portion into shallow containers, and chill within 2 hours."], 2),
    recipe("Breakfast", "mediterranean", "vegetarian", "Chickpea Avocado Breakfast Pita", [
      item("chickpeas", 0.85, "cup"), item("pita", 1, "count"), item("avocado", 0.5, "count"),
      item("cucumber", 1, "cup"), item("lemon", 0.5, "count"),
    ], ["Warm cooked drained chickpeas and the pita separately.", "Dice cucumber and combine it with the measured fresh lemon juice.", "Keep avocado and cucumber cold and assemble the pita immediately before eating."], 1),
    recipe("Breakfast", "italian", "vegetarian", "Egg White Marinara Breakfast Toast", [
      item("egg whites", 1, "cup"), item("whole grain bread", 2, "slices"),
      item("marinara sauce", 0.35, "cup"), item("spinach", 1.5, "cups"), item("mozzarella cheese", 0.2, "cup"),
    ], ["Cook egg whites until fully set and wilt spinach with a splash of water.", "Toast bread and warm the measured marinara.", "Top with egg whites, spinach, and mozzarella; cool leftovers in shallow containers within 2 hours."], 2),
    recipe("Breakfast", "indian", "vegetarian", "Masala Lentil Potato Breakfast Bowl", [
      item("lentils", 0.85, "cup"), item("baby potatoes", 5, "oz"),
      item("spinach", 2, "cups"), item("plain Greek yogurt", 120, "g"), item("masala spices", 1, "tsp"),
    ], ["Cook lentils in water, drain, and measure them cooked.", "Weigh potatoes raw and roast on parchment at 425 F; wilt spinach with water and the measured spice blend.", "Combine the hot ingredients and pack yogurt separately to add after reheating."], 1),
    recipe("Breakfast", "mexican", "turkey", "Turkey Salsa Quinoa Breakfast Bowl", [
      item("lean ground turkey", 4.5, "oz"), item("quinoa", 0.7, "cup"),
      item("corn", 0.6, "cup"), item("salsa", 0.3, "cup"), item("avocado", 0.25, "count"),
    ], ["Cook ground turkey to 165 F, measured with a food thermometer, then weigh the cooked portion.", "Cook quinoa in water and measure it cooked; warm and drain the corn.", "Portion with salsa, keep avocado separate, and chill in shallow containers within 2 hours."], 2),
  ];

  return {
    breakfast,
    lunch: buildCuisineMeals("Lunch"),
    dinner: buildCuisineMeals("Dinner"),
  };
}

function buildCuisineMeals(label) {
  const mealProfiles = {
    Lunch: { proteinOz: 6, format: "Bowl", intensity: 1 },
    Dinner: { proteinOz: 7, format: "Plate", intensity: 1.08 },
  };
  const profile = mealProfiles[label];
  const cuisineTemplates = {
    american: [
      ["Barbecue", "brown rice", 0.75, "cup", "slaw mix", 1.25, "cups", "barbecue sauce", 2, "tbsp"],
      ["Ranch Potato", "baby potatoes", 8, "oz", "green beans", 1.5, "cups", "steak seasoning", 1, "tsp"],
      ["Sweet Potato", "sweet potato", 1, "count", "broccoli", 1.4, "cups", "olive oil", 1, "tbsp"],
      ["Buffalo Rice", "rice", 0.75, "cup", "slaw mix", 1.4, "cups", "barbecue sauce", 1.5, "tbsp"],
      ["Garden Farro", "farro", 0.75, "cup", "asparagus", 1.25, "cups", "lemon", 0.5, "count"],
      ["Harvest Bean", "pinto beans", 0.65, "cup", "corn", 0.75, "cup", "steak seasoning", 1, "tsp"],
      ["Lemon Green", "quinoa", 0.75, "cup", "green beans", 1.6, "cups", "lemon", 0.5, "count"],
    ],
    mexican: [
      ["Fajita", "rice", 0.75, "cup", "fajita vegetables", 1.5, "cups", "salsa", 0.3, "cup"],
      ["Taco Bean", "black beans", 0.75, "cup", "romaine lettuce", 1.2, "cups", "taco seasoning", 1, "tbsp"],
      ["Salsa Verde", "quinoa", 0.75, "cup", "corn", 0.6, "cup", "salsa", 0.3, "cup"],
      ["Burrito", "pinto beans", 0.75, "cup", "fajita vegetables", 1.25, "cups", "salsa", 0.25, "cup"],
      ["Street Corn", "brown rice", 0.75, "cup", "corn", 0.85, "cup", "taco seasoning", 1, "tbsp"],
      ["Chipotle", "black beans", 0.65, "cup", "bell peppers", 1.35, "cups", "taco seasoning", 1, "tbsp"],
      ["Taco Sweet Potato", "sweet potato", 1, "count", "romaine lettuce", 1.25, "cups", "salsa", 0.3, "cup"],
    ],
    italian: [
      ["Marinara", "protein pasta", 56, "g", "zucchini", 1.25, "cups", "marinara sauce", 0.5, "cup"],
      ["Pesto Farro", "farro", 0.75, "cup", "spinach", 1.5, "cups", "parmesan cheese", 2, "tbsp"],
      ["Tomato Basil", "brown rice", 0.75, "cup", "bell peppers", 1.2, "cups", "tomato sauce", 0.5, "cup"],
      ["Alfredo Broccoli", "protein pasta", 56, "g", "broccoli", 1.5, "cups", "Alfredo sauce", 0.35, "cup"],
      ["Arrabbiata", "protein pasta", 56, "g", "bell peppers", 1.25, "cups", "marinara sauce", 0.55, "cup"],
      ["Garlic Tomato", "quinoa", 0.75, "cup", "zucchini", 1.5, "cups", "garlic", 2, "clove"],
      ["Mozzarella Bake", "protein pasta", 56, "g", "spinach", 1.5, "cups", "mozzarella cheese", 0.25, "cup"],
    ],
    mediterranean: [
      ["Greek", "quinoa", 0.75, "cup", "romaine lettuce", 1.4, "cups", "tzatziki", 2, "tbsp"],
      ["Hummus Pita", "pita", 1, "count", "spinach", 1.5, "cups", "hummus", 2, "tbsp"],
      ["Lemon Couscous", "couscous", 0.75, "cup", "asparagus", 1.1, "cups", "lemon", 0.5, "count"],
      ["Chickpea Garden", "chickpeas", 0.75, "cup", "bell peppers", 1.25, "cups", "olive oil", 1, "tbsp"],
      ["Za'atar Rice", "brown rice", 0.75, "cup", "green beans", 1.5, "cups", "hummus", 1.5, "tbsp"],
      ["Herbed Farro", "farro", 0.75, "cup", "spinach", 1.7, "cups", "tzatziki", 2, "tbsp"],
      ["Olive Lemon", "quinoa", 0.75, "cup", "asparagus", 1.4, "cups", "olive oil", 1, "tbsp"],
    ],
    indian: [
      ["Tikka Masala", "basmati rice", 0.75, "cup", "bell peppers", 1.5, "cups", "tikka masala sauce", 3, "tbsp"],
      ["Curry", "cauliflower rice", 1.5, "cups", "spinach", 2, "cups", "curry simmer sauce", 0.5, "cup"],
      ["Masala Lentil", "lentils", 0.75, "cup", "onion", 0.5, "count", "masala spices", 1, "tbsp"],
      ["Ginger Naan", "naan", 1, "count", "green beans", 1.2, "cups", "ginger", 1, "tbsp"],
      ["Yogurt Spice", "brown rice", 0.75, "cup", "broccoli", 1.5, "cups", "yogurt sauce", 2, "tbsp"],
      ["Saag", "basmati rice", 0.75, "cup", "spinach", 2.2, "cups", "coconut cream", 2, "tbsp"],
      ["Coconut Quinoa", "quinoa", 0.75, "cup", "cauliflower rice", 1.25, "cups", "coconut cream", 2, "tbsp"],
    ],
    asian: [
      ["Teriyaki", "brown rice", 0.75, "cup", "broccoli", 1.5, "cups", "teriyaki sauce", 2, "tbsp"],
      ["Soy Ginger", "rice", 0.75, "cup", "stir fry vegetables", 1.5, "cups", "soy sauce", 1, "tbsp"],
      ["Edamame", "quinoa", 0.75, "cup", "edamame", 0.75, "cup", "ginger", 1, "tbsp"],
      ["Garlic Snap Pea", "brown rice", 0.75, "cup", "snap peas", 1.25, "cups", "garlic", 2, "clove"],
      ["Sesame Broccoli", "rice", 0.75, "cup", "broccoli", 1.7, "cups", "soy sauce", 1.2, "tbsp"],
      ["Sweet Teriyaki", "rice", 0.75, "cup", "stir fry vegetables", 1.6, "cups", "teriyaki sauce", 2.2, "tbsp"],
      ["Ginger Quinoa", "quinoa", 0.75, "cup", "snap peas", 1.35, "cups", "ginger", 1, "tbsp"],
    ],
  };

  return Object.entries(cuisineTemplates).flatMap(([cuisine, templates]) =>
    Object.keys(PROTEINS).flatMap((proteinType) =>
      templates.map((template) => cuisineRecipe(label, cuisine, proteinType, template, profile))
    )
  );
}

function cuisineRecipe(label, cuisine, proteinType, template, profile) {
  const [style, carbName, carbAmount, carbUnit, produceName, produceAmount, produceUnit, sauceName, sauceAmount, sauceUnit] = template;
  const protein = proteinItem(proteinType, label, profile.proteinOz * profile.intensity);
  const ingredients = [
    ...protein,
    item(carbName, carbAmount, carbUnit),
    item(produceName, produceAmount, produceUnit),
    item(sauceName, sauceAmount, sauceUnit),
  ];

  const proteinLabel = PROTEINS[proteinType].label;
  return recipe(
    label,
    cuisine,
    proteinType,
    `${style} ${proteinLabel} ${profile.format}`,
    ingredients,
    cookingSteps({ cuisine, proteinType, proteinLabel, carbName, produceName, sauceName, format: profile.format }),
    PROTEINS[proteinType].cost
  );
}

function cookingSteps({ cuisine, proteinType, proteinLabel, carbName, produceName, sauceName, format }) {
  return [
    carbStep(carbName),
    produceStep(produceName),
    proteinStep(proteinType, proteinLabel, cuisine, sauceName),
    sauceStep(sauceName),
    `Build each ${format.toLowerCase()} with the carb base first, then ${produceName}, then the cooked ${proteinLabel.toLowerCase()} component.`,
    "Use only the listed ingredients plus water. Added oil, butter, toppings, or seasonings are optional extras outside the nutrition estimate and may conflict with your exclusions.",
    "Divide promptly into shallow containers. Refrigerate or freeze within 2 hours; cover once chilled.",
  ];
}

function carbStep(name) {
  if (name.includes("pasta")) return `Weigh ${name} dry, then boil in water until al dente and drain. The listed grams are dry pasta, not cooked weight.`;
  if (name.includes("potato")) return `Weigh ${name} raw, cut evenly, and roast at 425 F on parchment until tender; no extra oil is included.`;
  if (name.includes("naan") || name.includes("pita")) return `Weigh ${name} as sold, warm briefly, then pack separately.`;
  if (name.includes("cauliflower rice")) return `Weigh raw cauliflower as listed, rice it, and steam or cook in a nonstick pan with a splash of water.`;
  if (name.includes("beans") || name.includes("chickpeas") || name.includes("lentils")) return `Cook ${name} in water until tender, drain, and measure the listed cooked amount. Cooked amounts are not dry amounts.`;
  return `Cook ${name} in water according to its package, then measure the listed cooked quantity. Use enough dry grain to yield that amount; no universal dry-to-cooked conversion is assumed.`;
}

function produceStep(name) {
  if (INGREDIENT_BLENDS[name]) return `Combine the listed ingredients marked "for ${name}". Keep slaw raw; cook fajita or stir-fry vegetables in a nonstick pan with water, without unlisted oil.`;
  if (name.includes("romaine") || name.includes("spinach")) return `Measure ${name} raw, wash and dry it, and keep it cold or wilt it with a little water before serving.`;
  if (["corn", "peas", "edamame"].includes(name)) return `Cook ${name}, drain, then measure the listed cooked quantity before portioning.`;
  return `Measure ${name} raw as listed, then steam or cook in a nonstick pan with water until tender-crisp.`;
}

function proteinStep(type, label, cuisine, sauceName) {
  if (type === "chicken") return "Cook chicken without extra oil to 165 F, rest, then weigh the listed cooked meat quantity. Raw purchase weight will vary with cooking yield.";
  if (type === "beef") return "Cook ground beef to 160 F; cook steak to 145 F and rest it for 3 minutes. Use a food thermometer, add no extra oil, then weigh the listed cooked quantity.";
  if (type === "turkey") return "Cook 93% lean ground turkey without extra oil to 165 F, measured with a food thermometer, then weigh the listed cooked crumbles.";
  if (type === "fish") return "Cook salmon to 145 F, measured with a food thermometer, and weigh the cooked edible portion. For canned tuna, drain and weigh the solids; the reference can is 165 g drained.";
  return "Drain tofu and weigh it before cooking, then cook in a nonstick pan with a splash of water. Prepare legumes separately and measure their listed cooked, drained quantities.";
}

function sauceStep(name) {
  if (INGREDIENT_BLENDS[name]) {
    return name.includes("seasoning") || name.includes("spices")
      ? `Combine the listed components marked "for ${name}"; grind any seeds and toss the blend with the cooked ingredients.`
      : `Mix the listed components marked "for ${name}" and keep the sauce cold. Add it after reheating.`;
  }
  if (name.includes("seasoning") || name === "ginger" || name === "garlic") return `Stir the listed ${name} into the pan with a splash of water, then toss with the cooked ingredients.`;
  if (name === "lemon") return "Use the listed weight of fresh lemon juice after reheating; lemon quantities refer to juice, not whole-fruit weight.";
  if (name.includes("hummus")) return `Pack the listed ${name} separately and add after reheating.`;
  if (name.includes("cheese")) return `Add the listed ${name} to the hot meal or keep it separate until serving.`;
  if (name === "olive oil") return "Drizzle the listed olive oil over the assembled meal; this measured oil is included in the nutrition totals.";
  return `Measure the listed ${name} using the reference product and spoon it over the meal or pack it separately.`;
}

function proteinItem(type, label, ounces) {
  const dinner = label === "Dinner";
  const rounded = Math.round(ounces * 2) / 2;
  const map = {
    chicken: [item("chicken breast", rounded, "oz")],
    beef: [item(dinner ? "sirloin steak" : "lean ground beef", rounded, "oz")],
    turkey: [item("lean ground turkey", rounded, "oz")],
    fish: [item(dinner ? "salmon fillet" : "canned tuna", dinner ? rounded : 1.7, dinner ? "oz" : "cans")],
    vegetarian: dinner
      ? [item("extra firm tofu", rounded, "oz"), item("edamame", 0.5, "cup")]
      : [item("extra firm tofu", Math.max(6, rounded - 1), "oz"), item("chickpeas", 0.5, "cup")],
  };
  return map[type];
}

function recipe(label, cuisine, proteinType, name, ingredients, steps, cost = 2) {
  const normalized = {
    id: `${label}-${cuisine}-${proteinType}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    label,
    cuisine,
    proteinType,
    name,
    ingredients: ingredients.flatMap(expandIngredient),
    steps,
    cost,
  };
  normalized.allergens = [...new Set(normalized.ingredients.flatMap((ingredient) =>
    (INGREDIENT_TAGS[ingredient.name] || []).filter((tag) => ["dairy", "eggs", "fish", "legumes"].includes(tag))))].sort();
  normalized.macros = macrosForMeal(normalized.ingredients);
  normalized.searchText = `${name} ${ingredients.map((ingredient) => ingredient.name).join(" ")}`.toLowerCase();
  return normalized;
}

function item(name, amount, unit) {
  return { name, amount, unit };
}

function macrosForMeal(ingredients) {
  return ingredients.reduce((sum, ingredient) => {
    const macro = macrosForIngredient(ingredient);
    return addMacros(sum, macro);
  }, emptyMacros());
}

function macrosForIngredient(ingredient) {
  const grams = ingredientGrams(ingredient);
  const entry = NUTRITION[ingredient.name];
  const factor = grams / entry.reference.amount;
  return Object.fromEntries(Object.entries(entry.macros).map(([key, value]) => [key, value * factor]));
}

function supplementalPowderIngredient(proteinGrams) {
  if (!Number.isFinite(proteinGrams) || proteinGrams < 0) throw new Error("Invalid supplemental protein amount");
  const ref = NUTRITION["whey protein powder"];
  return { name: "whey protein powder", amount: proteinGrams / ref.macros.protein * ref.reference.amount,
    unit: "g", preparation: ref.preparation };
}

function addMacros(a, b) {
  return {
    protein: a.protein + b.protein,
    calories: a.calories + b.calories,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
  };
}

function emptyMacros() {
  return { protein: 0, calories: 0, carbs: 0, fat: 0 };
}

const RECIPES = buildRecipeLibrary();
const recipeDataIssues = validateRecipeIngredients(RECIPES);
if (recipeDataIssues.missingMacros.length) {
  console.error(`PrepFit: missing nutrition references for: ${recipeDataIssues.missingMacros.join(", ")}. Macro totals for affected recipes will be wrong.`);
}
if (recipeDataIssues.missingCategory.length) {
  console.error(`PrepFit: missing CATEGORY_BY_INGREDIENT entries for: ${recipeDataIssues.missingCategory.join(", ")}. These ingredients will be grouped under "Other" in the grocery list.`);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PROTEINS,
    INGREDIENT_TAGS,
    CATEGORY_BY_INGREDIENT,
    NUTRITION,
    INGREDIENT_BLENDS,
    ingredientGrams,
    nutritionUnit,
    expandIngredient,
    supplementalPowderIngredient,
    RECIPES,
    validateRecipeIngredients,
    macrosForMeal,
    macrosForIngredient,
    addMacros,
    emptyMacros,
  };
}
