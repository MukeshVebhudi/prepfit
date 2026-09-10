const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class TestResponse {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.type = options.type || "basic";
  }
  clone() { return new TestResponse(this.body, { status: this.status, type: this.type }); }
  static error() { return new TestResponse("", { status: 500, type: "error" }); }
}

const stores = new Map();
const requestUrl = (request) => typeof request === "string" ? request : request.url;
function openCache(name) {
  if (!stores.has(name)) stores.set(name, new Map());
  const store = stores.get(name);
  return {
    async addAll(urls) { urls.forEach((url) => store.set(url, new TestResponse(`cached:${url}`))); },
    async match(request) { return store.get(requestUrl(request)); },
    async put(request, response) { store.set(requestUrl(request), response); },
  };
}

const listeners = {};
let online = true;
const context = vm.createContext({
  URL,
  Response: TestResponse,
  caches: {
    open: async (name) => openCache(name),
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
  },
  fetch: async (request) => {
    if (!online) throw new Error("offline");
    return new TestResponse(`network:${requestUrl(request)}`);
  },
  self: {
    registration: { scope: "https://example.test/apps/prepfit/" },
    addEventListener(type, handler) { listeners[type] = handler; },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  },
});
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "service-worker.js"), "utf8"), context);

async function dispatched(type, request) {
  let promise;
  listeners[type]({
    request,
    waitUntil(value) { promise = value; },
    respondWith(value) { promise = value; },
  });
  return promise;
}

(async () => {
  await dispatched("install");
  const cacheName = vm.runInContext("CACHE_NAME", context);
  const prefix = vm.runInContext("CACHE_PREFIX", context);
  const shell = vm.runInContext("APP_SHELL", context);
  assert.ok(cacheName.includes(encodeURIComponent("/apps/prepfit/")));
  assert.ok(shell.every((url) => url.startsWith("https://example.test/apps/prepfit/")));
  assert.ok(stores.get(cacheName).has("https://example.test/apps/prepfit/manifest.webmanifest"));

  stores.set(`${prefix}old`, new Map());
  stores.set("another-app-cache", new Map());
  await dispatched("activate");
  assert.equal(stores.has(`${prefix}old`), false);
  assert.equal(stores.has("another-app-cache"), true);

  online = false;
  const offlinePage = await dispatched("fetch", {
    method: "GET", mode: "navigate", url: "https://example.test/apps/prepfit/today",
  });
  assert.match(offlinePage.body, /index\.html/);

  await assert.rejects(() => dispatched("fetch", {
    method: "GET", mode: "no-cors", url: "https://example.test/apps/prepfit/missing.png",
  }));

  let outsideHandled = false;
  listeners.fetch({
    request: { method: "GET", mode: "navigate", url: "https://example.test/another-app/" },
    respondWith() { outsideHandled = true; },
  });
  assert.equal(outsideHandled, false);

  online = true;
  const livePage = await dispatched("fetch", {
    method: "GET", mode: "navigate", url: "https://example.test/apps/prepfit/",
  });
  assert.match(livePage.body, /^network:/);

  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.webmanifest"), "utf8"));
  assert.equal(manifest.id, "./");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.ok(manifest.icons.some((icon) => icon.src === "assets/prepfit-icon.svg" && icon.purpose.includes("maskable")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "assets", "prepfit-icon.svg")));

  console.log("PASS: scoped caching, offline navigation, asset failures, updates, and subdirectory metadata");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
