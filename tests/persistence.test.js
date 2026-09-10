const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { loadAppSources } = require("./load-app");

const values = new Map();
const localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, String(value)); },
  removeItem(key) { values.delete(key); },
};
const elements = new Map();
const context = vm.createContext({
  console,
  localStorage,
  document: {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, { textContent: "", innerHTML: "", dataset: {} });
      return elements.get(selector);
    },
  },
  assert,
});

for (const source of loadAppSources(path.join(__dirname, ".."))) {
  vm.runInContext(source, context);
}

vm.runInContext(`
renderCurrentState = () => {};
currentAccount = { id: 'alice', name: 'Alice' };
const settings = { ...DEFAULTS, dailyTarget: 150, excluded: [], days: 2, mealMode: 'variety' };
const plan = buildPlan(settings, { shuffle: true });
const groceries = aggregateGroceries(plan.days, settings.people, settings.powderProtein);
const averages = averageMacros(plan.days);
state = { settings, plan, groceries, averages, warning: buildWarning(plan, settings, averages) };

const first = groceries[0];
purchasedItems = new Map([[groceryItemKey(first), groceryQuantitySignature(first)]]);
assert.equal(savePlannerState(), true);
const savedRaw = localStorage.getItem(accountStorageKey('planner'));
const saved = JSON.parse(savedRaw);
assert.equal(saved.schemaVersion, 1);
assert.equal(saved.plan.days.length, 2);
assert.equal(saved.purchases[groceryItemKey(first)], groceryQuantitySignature(first));

const restored = validatedStoredPlan(saved.plan, settings);
assert.ok(restored);
assert.deepEqual(
  restored.days.map(day => day.meals.map(meal => [meal.name, meal.portionRatio, meal.ingredients.map(i => i.amount)])),
  plan.days.map(day => day.meals.map(meal => [meal.name, meal.portionRatio, meal.ingredients.map(i => i.amount)]))
);

assert.equal(reconcilePurchases(groceries, purchasedItems).size, 1);
const changedGroceries = groceries.map((item, index) => index ? item : { ...item, amount: item.amount + 1 });
assert.equal(reconcilePurchases(changedGroceries, purchasedItems).size, 0);

assert.equal(validatedStoredPlan({ days: [{}], missingTypes: [] }, settings), null);
const damaged = JSON.parse(savedRaw);
damaged.plan.days[0].meals[0].ingredients[0].amount = -4;
assert.equal(validatedStoredPlan(damaged.plan, settings), null);

const aliceKey = accountStorageKey('planner');
currentAccount = { id: 'bob', name: 'Bob' };
const bobKey = accountStorageKey('planner');
assert.notEqual(aliceKey, bobKey);
assert.equal(localStorage.getItem(bobKey), null);

currentAccount = { id: 'alice', name: 'Alice' };
const beforeSwap = state.plan.days[0].meals[0].name;
swapMeal(0, 0);
const swappedRecord = JSON.parse(localStorage.getItem(aliceKey));
assert.notEqual(state.plan.days[0].meals[0].name, beforeSwap);
assert.equal(swappedRecord.plan.days[0].meals[0].name, state.plan.days[0].meals[0].name);

localStorage.setItem(accountStorageKey('settings'), JSON.stringify({ days: 4, powderProtein: 20 }));
const migratedSettings = persistence.loadSettings(accountStorageKey('settings'), STORAGE_KEYS.settings, DEFAULTS);
assert.equal(migratedSettings.supplementMode, 'reference');
assert.equal(migratedSettings.supplementLabel, 'Whey protein powder');
const customSettings = { ...settings, supplementMode: 'custom', supplementLabel: 'Rice Blend',
  supplementAmount: 35, supplementCalories: 150, supplementCarbs: 6, supplementFat: 3,
  supplementAllergens: '' };
assert.equal(persistence.saveSettings(accountStorageKey('settings'), customSettings), true);
const restoredCustom = JSON.parse(localStorage.getItem(accountStorageKey('settings')));
assert.equal(restoredCustom.supplementLabel, 'Rice Blend');
assert.equal(restoredCustom.supplementCalories, 150);

const originalSetItem = localStorage.setItem;
localStorage.setItem = () => { throw new Error('quota'); };
assert.equal(safeSetItem('test', 'value'), false);
assert.match(storageMessage, /storage is unavailable/);
localStorage.setItem = originalSetItem;

console.log('PASS: exact plan, swaps, grocery progress, supplement migration, storage failure, and profile isolation');
`, context);
