const CACHE_NAME = "water-meter-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/css/style.css",
    "/manifest.json"
];

self.addEventListener("install", event => {
    console.log("[ServiceWorker] Install");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("activate", event => {
    console.log("[ServiceWorker] Activate");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
