import { parseJson } from "./storage.js";

export function createProfileStore({ storage, keys, dataTypes = ["settings", "planner", "favorites"] }) {
  function displayName(value) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, 24);
  }

  function isReservedId(id) {
    return ["guest", "__proto__", "prototype", "constructor", "toString"].includes(String(id));
  }

  function dataKey(id, type) {
    return `prepfit-account:${id}:${type}`;
  }

  function load() {
    const saved = parseJson(storage.get(keys.accounts));
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return Object.create(null);
    return Object.entries(saved).reduce((accounts, [key, profile]) => {
      if (!profile || typeof profile !== "object") return accounts;
      const id = String(profile.id || key);
      accounts[id] = {
        id,
        name: displayName(profile.name || id) || "Local profile",
        createdAt: profile.createdAt || new Date().toISOString(),
        ...(profile.guest || id === "guest" ? { guest: true } : {}),
      };
      return accounts;
    }, Object.create(null));
  }

  function save(profiles) {
    return storage.set(keys.accounts, JSON.stringify(profiles));
  }

  function uniqueId(name, profiles, prefix = "profile") {
    const slug = String(name || "profile").toLowerCase().normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "").slice(0, 32) || "profile";
    let id = `${prefix}:${slug}`;
    let suffix = 2;
    while (Object.prototype.hasOwnProperty.call(profiles, id) || isReservedId(id)) {
      id = `${prefix}:${slug}-${suffix}`;
      suffix += 1;
    }
    return id;
  }

  function nameExists(profiles, name, ignoredId = null) {
    const normalized = displayName(name).toLowerCase();
    return Object.values(profiles).some((profile) =>
      profile.id !== ignoredId && displayName(profile.name).toLowerCase() === normalized);
  }

  function copyData(fromId, toId) {
    for (const type of dataTypes) {
      const value = storage.get(dataKey(fromId, type));
      if (value !== null && !storage.set(dataKey(toId, type), value)) return false;
    }
    return true;
  }

  function removeData(id) {
    let removed = true;
    dataTypes.forEach((type) => {
      if (!storage.remove(dataKey(id, type))) removed = false;
    });
    return removed;
  }

  function migrateLegacy() {
    const raw = parseJson(storage.get(keys.accounts));
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
    const migrated = Object.create(null);
    const idChanges = new Map();
    let changed = false;
    Object.entries(raw).forEach(([key, legacy]) => {
      if (!legacy || typeof legacy !== "object") { changed = true; return; }
      const oldId = String(legacy.id || key);
      const name = displayName(legacy.name || legacy.email || oldId) || "Local profile";
      const needsSafeId = isReservedId(oldId) && oldId !== "guest";
      const id = needsSafeId ? uniqueId(name, migrated, "legacy") : oldId;
      if (needsSafeId) {
        copyData(oldId, id);
        idChanges.set(oldId, id);
        changed = true;
      }
      if (legacy.passcodeHash || legacy.email || legacy.provider) changed = true;
      migrated[id] = { id, name, createdAt: legacy.createdAt || new Date().toISOString(),
        ...(oldId === "guest" || legacy.guest ? { guest: true } : {}) };
    });
    if (changed && save(migrated)) {
      const currentId = storage.get(keys.currentAccount);
      if (idChanges.has(currentId)) storage.set(keys.currentAccount, idChanges.get(currentId));
    }
  }

  return { copyData, dataKey, displayName, isReservedId, load, migrateLegacy, nameExists, removeData, save, uniqueId };
}
