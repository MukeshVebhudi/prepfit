const assert = require("node:assert/strict");
const path = require("path");
const { RECIPES, INGREDIENT_TAGS, PROTEINS, validateRecipeIngredients } = require(path.join(__dirname, "..", "recipe-data.js"));

const issues = validateRecipeIngredients(RECIPES);
const totalRecipes = Object.values(RECIPES).flat().length;

let failed = false;

if (issues.missingMacros.length) {
  failed = true;
  console.error(`FAIL: ${issues.missingMacros.length} ingredient(s) missing from MACROS: ${issues.missingMacros.join(", ")}`);
}

if (issues.missingCategory.length) {
  failed = true;
  console.error(`FAIL: ${issues.missingCategory.length} ingredient(s) missing from CATEGORY_BY_INGREDIENT: ${issues.missingCategory.join(", ")}`);
}

for (const key of ["duplicateIds", "invalidFields", "invalidUnits", "invalidNutrition"]) {
  if (issues[key].length) {
    failed = true;
    console.error(`FAIL: ${key}: ${issues[key].join(", ")}`);
  }
}

const allRecipes = Object.values(RECIPES).flat();
assert.equal(new Set(allRecipes.map((recipe) => recipe.id)).size, allRecipes.length);
for (const recipe of allRecipes) {
  const expectedAllergens = [...new Set(recipe.ingredients.flatMap((ingredient) =>
    (INGREDIENT_TAGS[ingredient.name] || []).filter((tag) => ["dairy", "eggs", "fish", "legumes"].includes(tag))))].sort();
  assert.deepEqual(recipe.allergens, expectedAllergens, `${recipe.name}: allergen tags`);
}
assert.ok(RECIPES.breakfast.length >= 12, "breakfast catalog should support a varied week");
assert.ok(new Set(RECIPES.breakfast.map((recipe) => recipe.cuisine)).size >= 6, "breakfast cuisine coverage");
for (const proteinType of Object.keys(PROTEINS)) {
  assert.ok(RECIPES.breakfast.some((recipe) => recipe.proteinType === proteinType), `breakfast/${proteinType}`);
}
for (const type of ["lunch", "dinner"]) {
  for (const proteinType of Object.keys(PROTEINS)) {
    assert.ok(RECIPES[type].filter((recipe) => recipe.proteinType === proteinType).length >= 30, `${type}/${proteinType}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`PASS: data-integrity — ${totalRecipes} recipes with unique IDs, valid fields, units, nutrition, allergens, and dietary coverage.`);
