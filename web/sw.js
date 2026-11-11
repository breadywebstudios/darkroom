/* Bready Darkroom service worker: keeps the app working offline.
   Bump VERSION whenever files in web/ change (the build workflow does this automatically). */
const VERSION = "dev";
const CACHE = "darkroom-" + VERSION;
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "fonts/ibm-plex-sans-latin-400-normal.woff2",
  "fonts/ibm-plex-sans-latin-500-normal.woff2",
  "fonts/ibm-plex-sans-latin-600-normal.woff2",
  "fonts/ibm-plex-sans-condensed-latin-500-normal.woff2",
  "fonts/ibm-plex-sans-condensed-latin-600-normal.woff2",
  "fonts/ibm-plex-mono-latin-400-normal.woff2",
  "fonts/ibm-plex-mono-latin-500-normal.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("darkroom-") && k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// app files: cache first (instant, offline). Page loads: network first so updates arrive, cache when offline.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("index.html", copy));
          return res;
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});

// the first install activates right away; updates wait until every window is closed
self.addEventListener("message", (e) => {
  if (e.data === "skipWaiting") self.skipWaiting();
});
