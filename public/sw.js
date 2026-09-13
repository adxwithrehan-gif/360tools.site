// 360tools Service Worker - Ultra-Clean Network-First Strategy
const CACHE_NAME = '360tools-cache-v3';

self.addEventListener('install', (event) => {
  // Immediately activate the new service worker without waiting
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Purge all old caches completely so users never get stuck with stale bundles
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Exclude ads, analytics, search console, and third-party scripts
  if (
    url.hostname.includes('professionalsusceptible') ||
    url.hostname.includes('google') ||
    url.hostname.includes('doubleclick') ||
    url.hostname.includes('googlesyndication') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // For HTML documents and main navigation: ALWAYS NETWORK FIRST
  // This guarantees users always get the freshest version of the application
  if (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/') || caches.match('/index.html');
        })
    );
    return;
  }

  // For static hashed assets (/assets/index-*.js, /assets/index-*.css): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

