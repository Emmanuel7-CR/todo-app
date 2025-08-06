const CACHE_NAME = 'todo-cache-v3.1';  // 🔄 Increment this when making changes
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-512.png',
  '/icons/screenshot-mobile.png',
  '/icons/screenshot-wide.png'
];

// INSTALL: Cache assets immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activate this service worker immediately
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // Keep only current version
          .map(key => caches.delete(key))    // Delete others
      )
    )
  );
  self.clients.claim(); // Start controlling all clients immediately
});

// FETCH: Serve from cache, then try network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Fallback: if HTML page fails, serve cached index.html
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});

