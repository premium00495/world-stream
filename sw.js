const CACHE_NAME = "worldstream-v1.0.0";

const urlsToCache = [
  "index.html",
  "style.css",
  "app.js",
  "player.html",
  "icon-192.png",
  "icon-512.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
