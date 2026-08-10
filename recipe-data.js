const PROTEINS = {
  chicken: { label: "Chicken", source: "chicken breast", cost: 2 },
  beef: { label: "Beef", source: "lean beef", cost: 4 },
  turkey: { label: "Turkey", source: "lean turkey", cost: 2 },
  fish: { label: "Fish", source: "salmon or tuna", cost: 4 },
  vegetarian: { label: "Vegetarian", source: "tofu, legumes, dairy", cost: 1 },
};

const CATEGORY_BY_INGREDIENT = {
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
  "light Alfredo sauce": "Dairy",
  "coconut cream": "Pantry",
  "whey protein powder": "Pantry",
  blueberries: "Produce",
  "peanut butter": "Pantry",
  tzatziki: "Dairy",
  "yogurt sauce": "Dairy",
};

const MACROS = {
  "chicken breast": { protein: 8, calories: 46, carbs: 0, fat: 1 },
  "lean ground beef": { protein: 7, calories: 52, carbs: 0, fat: 2.5 },
  "sirloin steak": { protein: 7, calories: 54, carbs: 0, fat: 2.4 },
  "lean ground turkey": { protein: 7, calories: 42, carbs: 0, fat: 1.5 },
  "salmon fillet": { protein: 6, calories: 58, carbs: 0, fat: 3.6 },
  "canned tuna": { protein: 22, calories: 105, carbs: 0, fat: 1 },
  "extra firm tofu": { protein: 3, calories: 26, carbs: 1, fat: 1.6 },
  tempeh: { protein: 5, calories: 55, carbs: 3, fat: 2.5 },
  "paneer cheese": { protein: 5, calories: 88, carbs: 1, fat: 7 },
  "egg whites": { protein: 26, calories: 126, carbs: 2, fat: 0 },
  "whole eggs": { protein: 6, calories: 72, carbs: 1, fat: 5 },
  "turkey slices": { protein: 5, calories: 30, carbs: 1, fat: 1 },
  "plain Greek yogurt": { protein: 24, calories: 145, carbs: 9, fat: 0 },
  "Greek yogurt": { protein: 22, calories: 140, carbs: 9, fat: 0 },
  "cottage cheese": { protein: 25, calories: 220, carbs: 8, fat: 5 },
  "whey protein powder": { protein: 24, calories: 120, carbs: 2, fat: 1 },
  edamame: { protein: 17, calories: 188, carbs: 14, fat: 8 },
  lentils: { protein: 18, calories: 230, carbs: 40, fat: 1 },
  chickpeas: { protein: 14, calories: 210, carbs: 35, fat: 4 },
  "black beans": { protein: 14, calories: 220, carbs: 40, fat: 1 },
  "pinto beans": { protein: 15, calories: 245, carbs: 45, fat: 1 },
  "kidney beans": { protein: 15, calories: 225, carbs: 40, fat: 1 },
  rice: { protein: 4, calories: 205, carbs: 45, fat: 0 },
  "brown rice": { protein: 5, calories: 215, carbs: 45, fat: 2 },
  "basmati rice": { protein: 4, calories: 205, carbs: 45, fat: 0 },
  quinoa: { protein: 8, calories: 222, carbs: 39, fat: 4 },
  farro: { protein: 6, calories: 170, carbs: 34, fat: 1 },
  couscous: { protein: 6, calories: 176, carbs: 36, fat: 0 },
  "protein pasta": { protein: 13, calories: 190, carbs: 34, fat: 2 },
  pita: { protein: 6, calories: 170, carbs: 33, fat: 1 },
  naan: { protein: 7, calories: 260, carbs: 44, fat: 6 },
  "whole grain bread": { protein: 4, calories: 95, carbs: 18, fat: 1.5 },
  oats: { protein: 5, calories: 150, carbs: 27, fat: 3 },
  "rolled oats": { protein: 5, calories: 150, carbs: 27, fat: 3 },
  broccoli: { protein: 3, calories: 55, carbs: 11, fat: 0 },
  spinach: { protein: 1, calories: 14, carbs: 2, fat: 0 },
  zucchini: { protein: 2, calories: 25, carbs: 5, fat: 0 },
  asparagus: { protein: 3, calories: 30, carbs: 5, fat: 0 },
  "green beans": { protein: 2, calories: 38, carbs: 8, fat: 0 },
  "bell peppers": { protein: 1, calories: 30, carbs: 7, fat: 0 },
  onion: { protein: 1, calories: 45, carbs: 11, fat: 0 },
  "sweet potato": { protein: 4, calories: 112, carbs: 26, fat: 0 },
  "baby potatoes": { protein: 5, calories: 175, carbs: 40, fat: 0 },
  "fajita vegetables": { protein: 2, calories: 70, carbs: 12, fat: 1 },
  "stir fry vegetables": { protein: 3, calories: 70, carbs: 12, fat: 1 },
  "snap peas": { protein: 2, calories: 40, carbs: 7, fat: 0 },
  "romaine lettuce": { protein: 1, calories: 10, carbs: 2, fat: 0 },
  "slaw mix": { protein: 1, calories: 25, carbs: 5, fat: 0 },
  corn: { protein: 3, calories: 75, carbs: 17, fat: 1 },
  peas: { protein: 4, calories: 67, carbs: 11, fat: 0 },
  avocado: { protein: 1, calories: 80, carbs: 4, fat: 7 },
  blueberries: { protein: 1, calories: 84, carbs: 21, fat: 0 },
  "peanut butter": { protein: 4, calories: 95, carbs: 3, fat: 8 },
  salsa: { protein: 1, calories: 18, carbs: 4, fat: 0 },
  "marinara sauce": { protein: 2, calories: 70, carbs: 10, fat: 2 },
  "tomato sauce": { protein: 2, calories: 60, carbs: 10, fat: 1 },
  "crushed tomatoes": { protein: 2, calories: 60, carbs: 12, fat: 0 },
  "teriyaki sauce": { protein: 1, calories: 35, carbs: 7, fat: 0 },
  "soy sauce": { protein: 1, calories: 10, carbs: 1, fat: 0 },
  "barbecue sauce": { protein: 0, calories: 55, carbs: 13, fat: 0 },
  "tikka masala sauce": { protein: 1, calories: 45, carbs: 5, fat: 2 },
  "curry simmer sauce": { protein: 2, calories: 90, carbs: 8, fat: 5 },
  hummus: { protein: 2, calories: 55, carbs: 4, fat: 3 },
  tzatziki: { protein: 2, calories: 30, carbs: 2, fat: 2 },
  "yogurt sauce": { protein: 2, calories: 35, carbs: 3, fat: 1 },
  "olive oil": { protein: 0, calories: 119, carbs: 0, fat: 14 },
  lemon: { protein: 0, calories: 8, carbs: 2, fat: 0 },
  garlic: { protein: 0, calories: 5, carbs: 1, fat: 0 },
  ginger: { protein: 0, calories: 5, carbs: 1, fat: 0 },
  "taco seasoning": { protein: 0, calories: 18, carbs: 3, fat: 0 },
  "chili seasoning": { protein: 0, calories: 18, carbs: 3, fat: 0 },
  "steak seasoning": { protein: 0, calories: 8, carbs: 1, fat: 0 },
  "masala spices": { protein: 0, calories: 18, carbs: 3, fat: 0 },
  "shredded cheese": { protein: 7, calories: 110, carbs: 1, fat: 9 },
  "mozzarella cheese": { protein: 7, calories: 85, carbs: 1, fat: 6 },
  "parmesan cheese": { protein: 5, calories: 45, carbs: 0, fat: 3 },
  "light Alfredo sauce": { protein: 2, calories: 60, carbs: 4, fat: 4 },
  "coconut cream": { protein: 1, calories: 60, carbs: 1, fat: 6 },
  "cauliflower rice": { protein: 2, calories: 25, carbs: 5, fat: 0 },
};

function validateRecipeIngredients(recipes) {
  const missingMacros = new Set();
  const missingCategory = new Set();

  Object.values(recipes).flat().forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!MACROS[ingredient.name]) missingMacros.add(ingredient.name);
      if (!CATEGORY_BY_INGREDIENT[ingredient.name]) missingCategory.add(ingredient.name);
    });
  });

  return { missingMacros: [...missingMacros], missingCategory: [...missingCategory] };
}

function buildRecipeLibrary() {
  const breakfast = [
    recipe("Breakfast", "classic", "vegetarian", "Greek Yogurt Power Oats", [
      item("plain Greek yogurt", 1, "cup"),
      item("rolled oats", 0.5, "cup"),
      item("whey protein powder", 0.5, "scoop"),
      item("blueberries", 0.5, "cup"),
      item("peanut butter", 1, "tbsp"),
    ], ["Stir yogurt, oats, and protein powder together.", "Top with blueberries and peanut butter.", "Chill overnight or portion immediately."], 1),
    recipe("Breakfast", "classic", "turkey", "Egg White Turkey Scramble", [
      item("egg whites", 1, "cup"),
      item("whole eggs", 1, "count"),
      item("turkey slices", 3, "oz"),
      item("spinach", 1, "cup"),
      item("shredded cheese", 0.15, "cup"),
    ], ["Cook turkey and spinach in a nonstick skillet.", "Add eggs and egg whites, then scramble until set.", "Cool before packing."], 2),
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
    ], ["Roast potatoes with masala spices.", "Sear paneer and wilt spinach.", "Top with a cooked egg before portioning."], 3),
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
      ["Marinara", "protein pasta", 2, "oz", "zucchini", 1.25, "cups", "marinara sauce", 0.5, "cup"],
      ["Pesto Farro", "farro", 0.75, "cup", "spinach", 1.5, "cups", "parmesan cheese", 2, "tbsp"],
      ["Tomato Basil", "brown rice", 0.75, "cup", "bell peppers", 1.2, "cups", "tomato sauce", 0.5, "cup"],
      ["Alfredo Broccoli", "protein pasta", 2, "oz", "broccoli", 1.5, "cups", "light Alfredo sauce", 0.35, "cup"],
      ["Arrabbiata", "protein pasta", 2, "oz", "bell peppers", 1.25, "cups", "marinara sauce", 0.55, "cup"],
      ["Garlic Tomato", "quinoa", 0.75, "cup", "zucchini", 1.5, "cups", "garlic", 2, "clove"],
      ["Mozzarella Bake", "protein pasta", 2, "oz", "spinach", 1.5, "cups", "mozzarella cheese", 0.25, "cup"],
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
    "Cool uncovered for 10 to 15 minutes, seal containers, refrigerate, and reheat hot items until steaming.",
  ];
}

function carbStep(name) {
  if (name.includes("pasta")) return `Boil ${name} until just al dente, rinse lightly, and toss with a spoon of sauce so it does not clump.`;
  if (name.includes("potato")) return `Roast ${name} at 425 F with a little oil, salt, and pepper until browned and tender.`;
  if (name.includes("naan") || name.includes("pita")) return `Warm ${name} briefly, then pack separately so it stays soft.`;
  if (name.includes("beans") || name.includes("chickpeas") || name.includes("lentils")) return `Drain and rinse ${name}, then simmer 5 minutes with seasoning so they absorb flavor.`;
  if (name.includes("cauliflower rice")) return `Saute ${name} in a wide pan until moisture cooks off and the texture is fluffy.`;
  return `Cook ${name} with a pinch of salt, then spread it out for a few minutes so steam escapes before packing.`;
}

function produceStep(name) {
  if (name.includes("romaine") || name.includes("slaw") || name.includes("spinach")) {
    return `Wash and dry ${name}; keep it cold or add it after reheating if you want it crisp.`;
  }
  if (name.includes("fajita") || name.includes("stir fry")) {
    return `Sear ${name} in a hot pan until lightly charred but still firm.`;
  }
  if (name.includes("broccoli") || name.includes("green beans") || name.includes("asparagus") || name.includes("snap peas")) {
    return `Steam or saute ${name} until bright and tender-crisp so it reheats well.`;
  }
  if (name.includes("corn") || name.includes("peas") || name.includes("edamame")) {
    return `Warm ${name} in a skillet and season lightly before adding to containers.`;
  }
  return `Chop ${name} evenly and cook just until tender so portions stay consistent.`;
}

function proteinStep(type, label, cuisine, sauceName) {
  const seasoning = cuisineSeasoning(cuisine);
  if (type === "chicken") {
    return `Season chicken with ${seasoning}, sear or bake to 165 F, rest 5 minutes, then slice for even portions.`;
  }
  if (type === "beef") {
    return `Season beef with ${seasoning}; brown ground beef fully or sear steak, rest it, then slice or crumble into portions.`;
  }
  if (type === "turkey") {
    return `Brown turkey with ${seasoning}, breaking it into small pieces so it mixes evenly through the ${sauceName}.`;
  }
  if (type === "fish") {
    return label === "Fish"
      ? `Bake salmon until just flaky or drain tuna well; add ${sauceName} after cooking so the fish stays moist.`
      : `Cook fish gently and keep it slightly saucy so it reheats without drying out.`;
  }
  return `Press tofu for 10 minutes, cube it, then sear until golden; warm legumes separately with ${seasoning}.`;
}

function sauceStep(name) {
  if (name.includes("seasoning") || name.includes("spices") || name === "ginger" || name === "garlic") {
    return `Bloom ${name} in the pan for 30 seconds before tossing with the cooked ingredients.`;
  }
  if (name.includes("yogurt") || name.includes("tzatziki") || name.includes("hummus")) {
    return `Pack ${name} in a small side cup and add it after reheating.`;
  }
  if (name.includes("lemon")) {
    return "Squeeze lemon over the meal after reheating for a fresher finish.";
  }
  return `Warm ${name} separately, then spoon it over portions or pack it on the side for better texture.`;
}

function cuisineSeasoning(cuisine) {
  return {
    american: "garlic, paprika, salt, and pepper",
    mexican: "taco seasoning, cumin, and a pinch of salt",
    italian: "garlic, Italian seasoning, salt, and pepper",
    mediterranean: "lemon, oregano, garlic, salt, and pepper",
    indian: "masala spices, ginger, garlic, and salt",
    asian: "soy sauce, ginger, garlic, and black pepper",
  }[cuisine] || "salt, pepper, and garlic";
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
    label,
    cuisine,
    proteinType,
    name,
    ingredients,
    steps,
    cost,
  };
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
  const base = MACROS[ingredient.name] || { protein: ingredient.protein || 0, calories: 25, carbs: 4, fat: 0 };
  const factor = ingredient.amount;
  return {
    protein: base.protein * factor,
    calories: base.calories * factor,
    carbs: base.carbs * factor,
    fat: base.fat * factor,
  };
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
  console.error(`PrepFit: missing MACROS entries for: ${recipeDataIssues.missingMacros.join(", ")}. Macro totals for affected recipes will be wrong.`);
}
if (recipeDataIssues.missingCategory.length) {
  console.error(`PrepFit: missing CATEGORY_BY_INGREDIENT entries for: ${recipeDataIssues.missingCategory.join(", ")}. These ingredients will be grouped under "Other" in the grocery list.`);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PROTEINS,
    CATEGORY_BY_INGREDIENT,
    MACROS,
    RECIPES,
    validateRecipeIngredients,
    macrosForMeal,
    macrosForIngredient,
    addMacros,
    emptyMacros,
  };
}
