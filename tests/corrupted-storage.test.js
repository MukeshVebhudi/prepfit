const assert = require("node:assert/strict");
const path = require("node:path");
const vm = require("node:vm");
const { loadAppSources } = require("./load-app");

const values = new Map();
const localStorage = {
  getItem(key) {
    return values.has(key) ? values.get(key) : null;
  },
  setItem(key, value) {
    values.set(key, String(value));
  },
  removeItem(key) {
    values.delete(key);
  },
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

for (const source of loadAppSources(path.join(__dirname, ".."))) vm.runInContext(source, context);

vm.runInContext(`
const settingsKey = 'corrupt:settings';
const plannerKey = 'corrupt:planner';

for (const malformed of ['{"days":', '[]', '"settings"', '42', 'null']) {
  localStorage.setItem(settingsKey, malformed);
  localStorage.removeItem(STORAGE_KEYS.settings);
  const loaded = persistence.loadSettings(settingsKey, STORAGE_KEYS.settings, DEFAULTS);
  assert.deepEqual(loaded, DEFAULTS);
}

localStorage.setItem(settingsKey, '{"days":4}');
const partialSettings = persistence.loadSettings(settingsKey, STORAGE_KEYS.settings, DEFAULTS);
assert.equal(partialSettings.days, 4);
assert.equal(partialSettings.people, DEFAULTS.people);
assert.equal(partialSettings.supplementMode, DEFAULTS.supplementMode);

localStorage.setItem(settingsKey, '[]');
localStorage.setItem(STORAGE_KEYS.settings, '{"days":6,"people":3}');
const migratedV1Settings = persistence.loadSettings(settingsKey, STORAGE_KEYS.settings, DEFAULTS);
assert.equal(migratedV1Settings.days, 6);
assert.equal(migratedV1Settings.people, 3);
assert.equal(migratedV1Settings.supplementLabel, DEFAULTS.supplementLabel);

const emptyPlan = { days: [], missingTypes: [] };
const validV1 = { schemaVersion: 1, settings: {}, plan: emptyPlan, purchases: {} };
localStorage.setItem(plannerKey, JSON.stringify(validV1));
const migratedV1Planner = persistence.loadPlanner(plannerKey);
assert.equal(migratedV1Planner.kind, 'ready');
assert.deepEqual(migratedV1Planner.record.grocery, { purchases: {}, pantry: [], manual: [] });

const validV2 = {
  schemaVersion: 2,
  settings: {},
  plan: emptyPlan,
  grocery: { purchases: {}, pantry: [], manual: [] },
};
localStorage.setItem(plannerKey, JSON.stringify(validV2));
assert.equal(persistence.loadPlanner(plannerKey).kind, 'ready');

const malformedPlanners = [
  '{"schemaVersion":2',
  '[]',
  '"planner"',
  JSON.stringify({ schemaVersion: 2, plan: emptyPlan, grocery: validV2.grocery }),
  JSON.stringify({ schemaVersion: 2, settings: [], plan: emptyPlan, grocery: validV2.grocery }),
  JSON.stringify({ schemaVersion: 2, settings: {}, plan: [], grocery: validV2.grocery }),
  JSON.stringify({ ...validV2, grocery: [] }),
  JSON.stringify({ ...validV2, grocery: { purchases: [], pantry: [], manual: [] } }),
  JSON.stringify({ ...validV2, grocery: { purchases: { item: false }, pantry: [], manual: [] } }),
  JSON.stringify({ ...validV2, grocery: { purchases: {}, pantry: 'item', manual: [] } }),
  JSON.stringify({ ...validV2, grocery: { purchases: {}, pantry: [], manual: [{}] } }),
  JSON.stringify({ ...validV1, purchases: [] }),
];

for (const malformed of malformedPlanners) {
  localStorage.setItem(plannerKey, malformed);
  const result = persistence.loadPlanner(plannerKey);
  assert.equal(result.kind, 'invalid');
  assert.equal(localStorage.getItem(plannerKey), null);
}

const malformedAccounts = ['{"profile":', '[]', '"accounts"', '42', 'null'];
for (const malformed of malformedAccounts) {
  localStorage.setItem(STORAGE_KEYS.accounts, malformed);
  assert.doesNotThrow(() => migrateLegacyProfiles());
  assert.deepEqual(Object.keys(loadAccounts()), []);
}

localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify({
  arrayProfile: [],
  nullProfile: null,
  stringProfile: 'broken',
  partial: {},
  valid: { id: 'valid', name: 'Valid profile' },
}));
assert.doesNotThrow(() => migrateLegacyProfiles());
const recoveredAccounts = loadAccounts();
assert.equal(recoveredAccounts.arrayProfile, undefined);
assert.equal(recoveredAccounts.nullProfile, undefined);
assert.equal(recoveredAccounts.stringProfile, undefined);
assert.equal(recoveredAccounts.partial.name, 'partial');
assert.equal(recoveredAccounts.valid.name, 'Valid profile');

console.log('PASS: corrupted settings, grocery schemas, and legacy profiles fall back safely');
`, context);
