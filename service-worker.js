const CACHE_VERSION = "v12";
const SCOPE_URL = new URL(self.registration.scope);
const CACHE_PREFIX = `prepfit-static:${encodeURIComponent(SCOPE_URL.pathname)}:`;
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./nutrition-data.js",
  "./nutrition.html",
  "./recipe-data.js",
  "./plan-math.js",
  "./app.js",
  "./modules/storage.js",
  "./modules/utils.js",
  "./modules/groceries.js",
  "./modules/export.js",
  "./modules/planner.js",
  "./modules/profiles.js",
  "./modules/persistence.js",
  "./modules/render.js",
  "./manifest.webmanifest",
  "./assets/prepfit-icon.svg",
].map((path) => new URL(path, SCOPE_URL).href);
const FALLBACK_URL = new URL("./index.html", SCOPE_URL).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== SCOPE_URL.origin || !requestUrl.pathname.startsWith(SCOPE_URL.pathname)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstPage(event.request));
    return;
  }

  event.respondWith(cacheFirstAsset(event.request));
});

async function networkFirstPage(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok && response.type !== "opaque") await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    const fallback = await cache.match(FALLBACK_URL);
    return cached || fallback || Response.error();
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type !== "opaque") await cache.put(request, response.clone());
  return response;
}
