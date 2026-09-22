const CACHE_VERSION = 'v1.0.0';
const CACHE_STATIC_NAME = `zera-static-${CACHE_VERSION}`;
const CACHE_DYNAMIC_NAME = `zera-dynamic-${CACHE_VERSION}`;

// Precache essential app shell assets
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Do not automatically skipWaiting here if we want the client prompt to govern it,
  // but allow skipWaiting when receiving the SKIP_WAITING message
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. NEVER intercept non-GET requests (e.g. POST, PUT, DELETE)
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // 2. NEVER cache API requests, Supabase backend calls, auth/login endpoints, or Next.js server actions
  const isApiRequest = 
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('supabase.in') ||
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/login') ||
    request.headers.get('x-next-server-action') !== null ||
    request.headers.get('purpose') === 'prefetch';

  if (isApiRequest) {
    return; // Pass through to standard network fetch
  }

  // 3. Navigation requests: Network-First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          // Check if cached version of page is available
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Otherwise return offline fallback page
          const fallback = await caches.match('/offline');
          return fallback || new Response('Offline - No connection', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // 4. Static assets (JS, CSS, Images, Fonts, Next.js static bundles): Stale-While-Revalidate
  const isStaticAsset = 
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|css|js|woff|woff2|ttf)$/i);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_STATIC_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failure: we already returned cachedResponse if available
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: try cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request);
    })
  );
});
