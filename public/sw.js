// This is the service worker for the application
// It will cache assets and API responses for better performance and offline capabilities

const CACHE_NAME = 'youclone-cache-v2';
const STATIC_CACHE_NAME = 'youclone-static-v2';
const DYNAMIC_CACHE_NAME = 'youclone-dynamic-v2';
const IMAGE_CACHE_NAME = 'youclone-images-v2';

// Assets that should be cached immediately on install
const urlsToCache = [
  '/',
  '/feed',
  '/profile',
  '/notifications',
  '/leaderboard',
  '/messages',
  '/compose',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
];

// Static assets that should be cached with a longer expiration
const staticAssets = [
  '/youlogo.svg',
  '/_next/static/css/',
  '/_next/static/chunks/',
];

// Cache expiration times
const DAY_IN_SECONDS = 24 * 60 * 60;
const STATIC_CACHE_EXPIRATION = 30 * DAY_IN_SECONDS; // 30 days
const DYNAMIC_CACHE_EXPIRATION = 7 * DAY_IN_SECONDS; // 7 days
const IMAGE_CACHE_EXPIRATION = 14 * DAY_IN_SECONDS; // 14 days

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache main app routes and assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching app shell and routes');
        return cache.addAll(urlsToCache);
      }),
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticAssets);
      })
    ])
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients as soon as the service worker activates
      return self.clients.claim();
    })
  );
});

// Helper function to determine which cache to use based on the request URL
function getCacheNameForRequest(url) {
  const urlObj = new URL(url);

  // Handle image caching
  if (
    urlObj.pathname.match(/\.(jpeg|jpg|png|gif|webp|svg|avif)$/) ||
    urlObj.hostname.includes('gateway.pinata.cloud') ||
    urlObj.hostname.includes('ipfs.io') ||
    urlObj.hostname.includes('api.dicebear.com')
  ) {
    return IMAGE_CACHE_NAME;
  }

  // Handle static assets
  if (
    urlObj.pathname.startsWith('/_next/static/') ||
    urlObj.pathname.match(/\.(css|js)$/)
  ) {
    return STATIC_CACHE_NAME;
  }

  // For API responses and other dynamic content
  if (urlObj.pathname.includes('/api/')) {
    // Don't cache authentication or points API calls
    if (
      urlObj.pathname.includes('/api/points') ||
      urlObj.pathname.includes('/api/auth')
    ) {
      return null; // Don't cache these
    }
    return DYNAMIC_CACHE_NAME;
  }

  // For main routes and other content
  return CACHE_NAME;
}

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = event.request.url;
  const cacheName = getCacheNameForRequest(url);

  // Skip caching if cacheName is null
  if (cacheName === null) {
    return;
  }

  // Network-first strategy for API calls (except those we don't want to cache)
  if (url.includes('/api/') && cacheName === DYNAMIC_CACHE_NAME) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone();

          caches.open(cacheName)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first strategy for everything else
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          // In the background, fetch a fresh copy for next time
          fetch(event.request)
            .then(response => {
              if (response.ok) {
                caches.open(cacheName)
                  .then(cache => {
                    cache.put(event.request, response);
                  });
              }
            })
            .catch(() => {/* Ignore network errors */});

          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || !response.ok) {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  } else if (event.tag === 'sync-likes') {
    event.waitUntil(syncLikes());
  } else if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

// Placeholder functions for background sync
function syncPosts() {
  // Implementation would go here
  return Promise.resolve();
}

function syncLikes() {
  // Implementation would go here
  return Promise.resolve();
}

function syncComments() {
  // Implementation would go here
  return Promise.resolve();
}
