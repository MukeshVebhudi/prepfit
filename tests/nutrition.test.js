const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {
  NUTRITION, RECIPES, ingredientGrams, macrosForIngredient, macrosForMeal,
  supplementalPowderIngredient, addMacros, emptyMacros,
} = require('../recipe-data');
const source = require('./fixtures/usda-reference.json');
Object.assign(global, { macrosForIngredient, macrosForMeal, supplementalPowderIngredient, addMacros, emptyMacros });
const { scaleMeal, macrosForDay } = require('../plan-math');
const ingredient = (name, amount, unit, extra = {}) => ({ name, amount, unit, ...extra });
function near(actual, expected, name, tolerance = 1e-8) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${name}: expected ${expected}, got ${actual}`);
}
function macros(actual, expected, name) {
  for (const key of ['protein', 'calories', 'carbs', 'fat']) near(actual[key], expected[key], `${name}/${key}`);
}

// Data provenance: source snapshot retains USDA nutrient IDs and household portion rows.
for (const [name, ref] of Object.entries(NUTRITION)) {
  assert.equal(ref.reference.unit, 'g', name);
  assert.ok(Number.isFinite(ref.reference.amount) && ref.reference.amount > 0, name);
  assert.ok(ref.preparation && ref.source.title && ref.source.checked, name);
  assert.equal(new URL(ref.source.url).protocol, 'https:', name);
  for (const key of ['protein', 'calories', 'carbs', 'fat']) assert.ok(Number.isFinite(ref.macros[key]) && ref.macros[key] >= 0, `${name}/${key}`);
  for (const weight of Object.values(ref.gramsPerUnit)) assert.ok(Number.isFinite(weight) && weight > 0, name);
  if (ref.source.fdcId) {
    const record = source.foods[ref.source.fdcId];
    assert.ok(record, name);
    assert.equal(ref.reference.amount, 100);
    assert.equal(ref.source.title, record.description);
    for (const [key, id] of Object.entries({ protein: 1003, calories: 1008, carbs: 1005, fat: 1004 })) {
      assert.equal(ref.macros[key], record.nutrients[id], `${name} must match USDA ${id}`);
    }
  }
}
for (const recipe of Object.values(RECIPES).flat()) {
  for (const item of recipe.ingredients) {
    assert.ok(NUTRITION[item.name], `${recipe.name}: ${item.name}`);
    assert.equal(item.preparation, NUTRITION[item.name].preparation);
    assert.ok(ingredientGrams(item) > 0);
  }
}

// Literal expected values calculated from the cited USDA records, not app helpers:
// Salsa FDC 174524: 29 kcal, P1.52 C6.64 F0.17 per 100g; selected 2 tbsp=36g.
macros(macrosForIngredient(ingredient('salsa', 2, 'tbsp')),
  { protein: 0.5472, calories: 10.44, carbs: 2.3904, fat: 0.0612 }, 'salsa reference');
near(macrosForIngredient(ingredient('salsa', 1, 'cup')).calories, 83.52, 'one normalized cup salsa');
macros(macrosForIngredient(ingredient('salsa', 1, 'cup')), macrosForIngredient(ingredient('salsa', 16, 'tbsp')), 'cup equals 16 tbsp');
macros(macrosForIngredient(ingredient('salsa', 3, 'tsp')), macrosForIngredient(ingredient('salsa', 1, 'tbsp')), '3 tsp equals tbsp');
macros(macrosForIngredient(ingredient('salsa', 236.5882365, 'ml')), macrosForIngredient(ingredient('salsa', 1, 'cup')), 'US customary cup');
macros(macrosForIngredient(ingredient('salsa', 8, 'fl oz')), macrosForIngredient(ingredient('salsa', 1, 'cup')), 'fluid ounces');
near(ingredientGrams(ingredient('olive oil', 1, 'tbsp')), 13.5, 'oil-specific density');
near(ingredientGrams(ingredient('peanut butter', 1, 'tbsp')), 16, 'peanut butter-specific density');
near(ingredientGrams(ingredient('salsa', 1, 'tbsp')), 18, 'salsa-specific density');
near(ingredientGrams(ingredient('chicken breast', 1, 'lb')), 453.59237, 'pound mass');
near(ingredientGrams(ingredient('chicken breast', 16, 'oz')), 453.59237, '16 ounces');
near(ingredientGrams(ingredient('chicken breast', 1, 'kg')), 1000, 'kilogram');
near(ingredientGrams(ingredient('whole eggs', 2, 'count')), 100, 'large shell-free eggs');
near(ingredientGrams(ingredient('canned tuna', 1, 'can')), 165, 'drained reference can');

// Manufacturer panel: 56g dry Barilla Protein+ Penne, not 190 kcal per ounce.
macros(macrosForIngredient(ingredient('protein pasta', 56, 'g')),
  { protein: 10, calories: 190, carbs: 39, fat: 1 }, 'dry pasta label');
near(macrosForIngredient(ingredient('protein pasta', 2, 'oz')).calories, 192.3717640625, 'exact ounce versus rounded label serving');
// USDA FDC 170026: 77 kcal per 100g raw potato, not 175 kcal per ounce.
near(macrosForIngredient(ingredient('baby potatoes', 8, 'oz')).calories, 174.63306245, 'raw potato portion');
macros(macrosForIngredient(ingredient('paneer cheese', 28, 'g')),
  { protein: 7, calories: 90, carbs: 1, fat: 7 }, 'Sach paneer label');
macros(macrosForIngredient(ingredient('Alfredo sauce', 0.25, 'cup')),
  { protein: 1, calories: 90, carbs: 2, fat: 9 }, 'RAGU reference label');
macros(macrosForIngredient(ingredient('tikka masala sauce', 0.25, 'cup')),
  { protein: 0, calories: 40, carbs: 5, fat: 2 }, 'Pataks protein lower bound');
assert.equal(NUTRITION['tikka masala sauce'].bounds.protein.maxExclusive, 1);

// Whole plate independently summed from FDC 171477, 168878 and 170379:
// 100g cooked chicken + 158g cooked rice + 91g raw broccoli.
const plate = {
  name: 'Reference plate', steps: [],
  ingredients: [ingredient('chicken breast', 100, 'g'), ingredient('rice', 1, 'cup'), ingredient('broccoli', 1, 'cup')],
};
plate.macros = macrosForMeal(plate.ingredients);
macros(plate.macros, { protein: 37.8164, calories: 401.34, carbs: 50.5984, fat: 4.3491 }, 'independent plate');
macros(scaleMeal(plate, 1.2).macros, { protein: 45.37968, calories: 481.608, carbs: 60.71808, fat: 5.21892 }, 'scaled reference plate');
assert.equal(plate.ingredients[0].amount, 100, 'scaling must not change source meal');
// FDC 170894, 173904, 173180, 171711, 174266: fixed, unscaled breakfast.
macros(RECIPES.breakfast.find(r => r.name === 'Greek Yogurt Power Oats').macros,
  { protein: 46.4216, calories: 489.275, carbs: 51.3565, fat: 12.2944 }, 'independent oats breakfast');
const powder = supplementalPowderIngredient(24);
near(powder.amount, 30.729833546734956, 'weighed supplement from USDA protein concentration');
const daily = macrosForDay([plate], 24);
near(daily.protein, 61.8164, 'supplement protein');
near(daily.calories, 509.50901408450707, 'supplement calories from reference');
macros(macrosForIngredient(ingredient('salsa', 0, 'g')), { protein: 0, calories: 0, carbs: 0, fat: 0 }, 'zero amount');
for (const invalid of [
  ingredient('unknown food', 1, 'g'), ingredient('salsa', 1, 'bucket'),
  ingredient('plain Greek yogurt', 1, 'cup'), ingredient('whey protein powder', 1, 'scoop'),
  ingredient('chicken breast', 1, 'cup'), ingredient('whole eggs', 1, 'clove'),
  ingredient('salsa', -1, 'g'), ingredient('salsa', NaN, 'g'), ingredient('salsa', Infinity, 'g'),
  ingredient('chicken breast', 100, 'g', { preparation: 'raw' }),
]) assert.throws(() => macrosForIngredient(invalid), Error, JSON.stringify(invalid));

// Exercise the shipped integration code without browser dependencies.
const ctx = vm.createContext({ console, assert, near, document: { querySelector: () => ({ dataset: {} }) } });
for (const file of ['nutrition-data.js', 'recipe-data.js', 'plan-math.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8').replace(/^initialize\(\);$/m, ''), ctx);
}
vm.runInContext(`
const groceryDays = [{ meals: [{ ingredients: [
  { name: 'salsa', amount: 1, unit: 'cup' }, { name: 'salsa', amount: 2, unit: 'tbsp' },
] }] }];
const groceries = aggregateGroceries(groceryDays, 2);
assert.equal(groceries.length, 1);
assert.equal(groceries[0].unit, 'g');
near(groceries[0].amount, 648, 'mixed-unit groceries for two people');
assert.match(formatIngredient({ name: 'chicken breast', amount: 100, unit: 'g' }, 1), /cooked/);
assert.match(formatIngredient({ name: 'protein pasta', amount: 56, unit: 'g' }, 1), /dry/);
assert.match(formatIngredient({ name: 'canned tuna', amount: 1, unit: 'can' }, 1), /drained.*165/);
const config = { ...DEFAULTS, dailyTarget: 150, excluded: [], powderProtein: 24 };
const plan = buildPlan(config);
const shopping = aggregateGroceries(plan.days, 2, 24);
const shoppingTotals = macrosForMeal(shopping);
const dayTotals = plan.days.reduce((sum, day) => addMacros(sum, day.macros), emptyMacros());
for (const key of ['protein', 'calories', 'carbs', 'fat']) near(shoppingTotals[key], dayTotals[key] * 2, 'shopping/day consistency ' + key, 1e-6);
const conflict = buildPlan({ ...config, excluded: ['dairy'] });
assert.equal(conflict.days.length, 0);
assert.match(buildWarning(conflict, config), /supplemental whey/);
for (const meal of recipeCandidates('Lunch', { ...config, excluded: ['garlic'] })) {
  assert.ok(!meal.ingredients.some(i => i.name.includes('garlic')));
}
for (const meal of recipeCandidates('Lunch', { ...config, excluded: ['slaw mix'] })) {
  assert.ok(!meal.ingredients.some(i => i.componentOf === 'slaw mix'));
}
`, ctx);
console.log('PASS: nutrition sources, independent meal totals, units, preparation states, errors, and grocery/supplement integration');
