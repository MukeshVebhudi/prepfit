const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs
  .readFileSync(path.join(__dirname, "..", "modules", "diagnostics.js"), "utf8")
  .replace(/^export\s+/gm, "");
const context = { console };
vm.createContext(context);
vm.runInContext(`${source}\nthis.createDebugInfo = createDebugInfo;`, context);

function fakeStorage(records = {}) {
  const data = new Map(Object.entries(records));
  return {
    get length() {
      return data.size;
    },
    key(index) {
      return [...data.keys()][index] ?? null;
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

(async () => {
  const storage = fakeStorage({
    "prepfit-settings-v2": JSON.stringify({ avoidIngredients: "private ingredient" }),
    "prepfit-account:secret-profile:planner": JSON.stringify({
      schemaVersion: 2,
      plan: { privateMeal: "private recipe" },
    }),
    "prepfit-accounts-v1": JSON.stringify({ "secret-profile": { name: "Private Person" } }),
  });
  const result = await context.createDebugInfo({
    storage,
    navigator: {
      clipboard: { writeText() {} },
      storage: { estimate: async () => ({ usage: 12, quota: 100 }) },
    },
    caches: { open() {} },
    schemaVersion: 2,
  });
  assert.deepEqual([...result.schemas.plannerVersionsPresent], [2]);
  assert.equal(result.storage.prepfitRecordCount, 3);
  assert.equal(result.storage.quota.usageBytes, 12);
  assert.equal(result.features.clipboardWrite, true);
  const exported = JSON.stringify(result);
  ["secret-profile", "Private Person", "private ingredient", "private recipe"].forEach((value) =>
    assert.equal(exported.includes(value), false),
  );

  const unavailable = new Proxy(
    {},
    {
      get() {
        throw new Error("storage disabled");
      },
    },
  );
  const degraded = await context.createDebugInfo({
    storage: unavailable,
    navigator: { storage: { estimate: async () => Promise.reject(new Error("denied")) } },
    schemaVersion: 2,
  });
  assert.equal(degraded.storage.readable, false);
  assert.equal(degraded.storage.writable, false);
  assert.equal(degraded.storage.quota.available, false);

  console.log("Diagnostic export tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
