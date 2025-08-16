self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('water-meter-cache').then(cache => cache.addAll([
            '/',
            '/index.html',
            '/app.js',
            '/manifest.json',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/chart.js'
        ]))
    );
});
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});