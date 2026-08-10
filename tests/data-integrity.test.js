const path = require("path");
const { RECIPES, validateRecipeIngredients } = require(path.join(__dirname, "..", "recipe-data.js"));

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

if (failed) {
  process.exit(1);
}

console.log(`PASS: data-integrity — ${totalRecipes} recipes, all ingredients have macros and a grocery category.`);
