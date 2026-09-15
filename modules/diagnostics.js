function safeStorageKeys(storage) {
  try {
    return Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(
      (key) => typeof key === "string",
    );
  } catch {
    return [];
  }
}

function storageStatus(storage) {
  const probe = `prepfit-diagnostic-probe:${Date.now()}`;
  let readable = false;
  let writable = false;
  try {
    storage.getItem(probe);
    readable = true;
  } catch {
    // Report the capability as unavailable without interrupting the app.
  }
  try {
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    writable = true;
  } catch {
    // Report the capability as unavailable without interrupting the app.
  }
  return { readable, writable };
}

function plannerVersions(storage, keys) {
  const versions = new Set();
  keys
    .filter((key) => key === "prepfit-planner-v1" || key.endsWith(":planner"))
    .forEach((key) => {
      try {
        const value = JSON.parse(storage.getItem(key));
        if (Number.isInteger(value?.schemaVersion)) versions.add(value.schemaVersion);
      } catch {
        // Malformed records are represented by their presence, not their contents.
      }
    });
  return [...versions].sort((left, right) => left - right);
}

async function quotaStatus(navigator) {
  if (typeof navigator?.storage?.estimate !== "function") return { supported: false };
  try {
    const estimate = await navigator.storage.estimate();
    return {
      supported: true,
      usageBytes: Number.isFinite(estimate?.usage) ? estimate.usage : null,
      quotaBytes: Number.isFinite(estimate?.quota) ? estimate.quota : null,
    };
  } catch {
    return { supported: true, available: false };
  }
}

export async function createDebugInfo({ storage, navigator, caches, schemaVersion }) {
  try {
    const keys = safeStorageKeys(storage);
    const prepfitKeys = keys.filter((key) => key.startsWith("prepfit-"));
    return {
      format: "prepfit-debug-v1",
      storage: {
        ...storageStatus(storage),
        quota: await quotaStatus(navigator),
        prepfitRecordCount: prepfitKeys.length,
      },
      schemas: {
        expectedPlanner: schemaVersion,
        plannerVersionsPresent: plannerVersions(storage, prepfitKeys),
        settingsV1Present: prepfitKeys.some((key) => key === "prepfit-settings-v1"),
        settingsV2Present: prepfitKeys.some(
          (key) => key === "prepfit-settings-v2" || key.endsWith(":settings"),
        ),
        accountsV1Present: prepfitKeys.includes("prepfit-accounts-v1"),
      },
      features: {
        serviceWorker: Boolean(navigator?.serviceWorker),
        cacheStorage: Boolean(caches && typeof caches.open === "function"),
        clipboardWrite: typeof navigator?.clipboard?.writeText === "function",
        storageEstimate: typeof navigator?.storage?.estimate === "function",
      },
    };
  } catch {
    return {
      format: "prepfit-debug-v1",
      storage: { readable: false, writable: false, quota: { supported: false } },
      schemas: { expectedPlanner: schemaVersion, plannerVersionsPresent: [] },
      features: {},
    };
  }
}
