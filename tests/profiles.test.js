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
  document: { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, { textContent: "", innerHTML: "", dataset: {} });
    return elements.get(selector);
  } },
  assert,
});

for (const source of loadAppSources(path.join(__dirname, ".."))) {
  vm.runInContext(source, context);
}

vm.runInContext(`
const legacy = {
  alice: { id: 'alice', name: 'Alice', passcodeHash: 'old-hash', createdAt: '2025-01-01' },
  'gmail:pat@gmail.com': { id: 'gmail:pat@gmail.com', name: 'pat@gmail.com', email: 'pat@gmail.com', provider: 'gmail-local' },
  constructor: { id: 'constructor', name: 'Reserved Name', passcodeHash: 'hash' },
};
localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(legacy));
localStorage.setItem(profileStorageKey('alice', 'planner'), '{"schemaVersion":1,"marker":"alice-plan"}');
localStorage.setItem(profileStorageKey('gmail:pat@gmail.com', 'favorites'), '["Meal"]');
localStorage.setItem(profileStorageKey('constructor', 'settings'), '{"days":4}');
localStorage.setItem(STORAGE_KEYS.currentAccount, 'constructor');
migrateLegacyProfiles();

const migrated = JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts));
assert.equal(migrated.alice.id, 'alice');
assert.equal(migrated.alice.passcodeHash, undefined);
assert.equal(migrated['gmail:pat@gmail.com'].id, 'gmail:pat@gmail.com');
assert.equal(migrated['gmail:pat@gmail.com'].email, undefined);
assert.equal(localStorage.getItem(profileStorageKey('alice', 'planner')), '{"schemaVersion":1,"marker":"alice-plan"}');
assert.equal(localStorage.getItem(profileStorageKey('gmail:pat@gmail.com', 'favorites')), '["Meal"]');

const reservedProfile = Object.values(migrated).find(account => account.name === 'Reserved Name');
assert.ok(reservedProfile.id.startsWith('legacy:'));
assert.equal(isReservedProfileId(reservedProfile.id), false);
assert.equal(localStorage.getItem(profileStorageKey(reservedProfile.id, 'settings')), '{"days":4}');
assert.equal(localStorage.getItem(STORAGE_KEYS.currentAccount), reservedProfile.id);

const loaded = loadAccounts();
assert.equal(Object.getPrototypeOf(loaded), null);
assert.equal(profileNameExists(loaded, ' ALICE '), true);
assert.equal(profileNameExists(loaded, 'Alice', 'alice'), false);
const firstId = uniqueProfileId('New Person', loaded);
loaded[firstId] = { id: firstId, name: 'New Person' };
assert.notEqual(uniqueProfileId('New Person', loaded), firstId);
assert.equal(isReservedProfileId(uniqueProfileId('__proto__', loaded)), false);

localStorage.setItem(profileStorageKey('guest', 'settings'), '{"days":6}');
localStorage.setItem(profileStorageKey('guest', 'planner'), '{"schemaVersion":1,"exact":true}');
localStorage.setItem(profileStorageKey('guest', 'favorites'), '["Favorite"]');
assert.equal(copyProfileData('guest', 'profile:mukesh'), true);
for (const type of ['settings', 'planner', 'favorites']) {
  assert.equal(localStorage.getItem(profileStorageKey('profile:mukesh', type)), localStorage.getItem(profileStorageKey('guest', type)));
}
assert.equal(removeProfileData('guest'), true);
assert.equal(localStorage.getItem(profileStorageKey('guest', 'planner')), null);
assert.equal(localStorage.getItem(profileStorageKey('profile:mukesh', 'planner')), '{"schemaVersion":1,"exact":true}');

currentAccount = { id: 'alice' };
const alicePlannerKey = accountStorageKey('planner');
currentAccount = { id: 'profile:mukesh' };
assert.notEqual(accountStorageKey('planner'), alicePlannerKey);

console.log('PASS: legacy migration, guest conversion, duplicates, reserved IDs, and profile isolation');
`, context);
