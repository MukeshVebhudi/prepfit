const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the shipped classic scripts with inert DOM elements; skip startup only.
const elements = new Map();
const context = vm.createContext({ console, document: { querySelector(selector) {
  if (!elements.has(selector)) elements.set(selector, { textContent: '', innerHTML: '', dataset: {} });
  return elements.get(selector);
} }, assert });
for (const file of ['nutrition-data.js', 'recipe-data.js', 'plan-math.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
    .replace(/^initialize\(\);$/m, ''), context);
}
vm.runInContext(`
const base = { ...DEFAULTS, dailyTarget: 150, excluded: [], days: 3 };
for (const mealMode of ['batch', 'variety']) {
  for (const shuffle of [false, true]) {
    for (let repeat = 0; repeat < 12; repeat++) {
      const settings = { ...base, mealMode, meat: 'vegetarian', excluded: ['peanut butter'] };
      const plan = buildPlan(settings, { shuffle });
      assert.equal(plan.days.length, 3);
      for (const meal of plan.days.flatMap(day => day.meals)) {
        assert.equal(meal.proteinType, 'vegetarian');
        assert.ok(!meal.ingredients.some(i => /turkey|chicken|beef|sirloin steak|salmon|tuna|peanut butter/.test(i.name)));
      }
      state = { settings, plan, warning: '' };
      swapMeal(0, 0);
      swapMeal(0, 1);
      assert.deepEqual(state.averages, averageMacros(state.plan.days));
      assert.equal(state.warning, buildWarning(state.plan, settings, state.averages));
      assert.equal(targetResults(state.averages, settings).length, 1);
      for (const meal of state.plan.days.flatMap(day => day.meals)) {
        assert.equal(meal.proteinType, 'vegetarian');
        assert.ok(!meal.ingredients.some(i => /turkey|chicken|beef|sirloin steak|salmon|tuna|peanut butter/.test(i.name)));
      }
    }
  }
  const settings = { ...base, mealMode, excluded: ['chicken'] };
  const plan = buildPlan(settings, { shuffle: true });
  assert.equal(plan.days.length, 0);
  assert.deepEqual(Array.from(plan.missingTypes), ['Lunch', 'Dinner']);
  const warning = buildWarning(plan, settings);
  assert.match(warning, /Restrictions have not been relaxed/);
  renderSummary(settings, plan, averageMacros(plan.days), warning);
  renderMeals(plan, settings);
  renderPrepSchedule(plan, settings);
  assert.equal(dom.summaryStats.innerHTML, '');
  assert.equal(dom.planStatus.textContent, 'No matches');
  assert.match(dom.prepSchedule.innerHTML, /complete plan/);
}
for (const type of MEAL_TYPES) {
  for (const recipe of recipeCandidates(type, { ...base, excluded: ['dairy'] })) {
    assert.ok(!recipe.ingredients.some(i => /yogurt|cheese|whey|Alfredo|tzatziki|tikka masala/.test(i.name)));
  }
}
assert.equal(recipeCandidates('Breakfast', { ...base, meat: 'vegetarian', excluded: ['dairy'] }).length, 0);
assert.equal(recipeCandidates('Lunch', { ...base, meat: 'vegetarian', excluded: ['legumes'] }).length, 0);
assert.equal(recipeCandidates('Breakfast', { ...base, excluded: ['eggs'] }).length, 1);
assert.equal(recipeCandidates('Dinner', { ...base, meat: 'fish', excluded: ['fish'] }).length, 0);
// Only one breakfast remains; swapping must retain it rather than bypass exclusions.
const singleSettings = { ...base, meat: 'vegetarian', excluded: ['eggs'] };
const singlePlan = buildPlan(singleSettings);
state = { settings: singleSettings, plan: singlePlan, warning: '' };
const before = JSON.stringify(state.plan);
swapMeal(0, 0);
assert.equal(JSON.stringify(state.plan), before);
assert.match(dom.plannerNote.textContent, /No alternative breakfast/);
console.log('PASS: dietary generation, shuffle, swaps, category exclusions, and no-match rendering');
`, context);
