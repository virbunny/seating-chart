const CACHE_NAME = 'mitu-seat-v2026.04.30-61';
const APP_VERSION = 'v2026.04.30-61';
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './icons/icon-64-v61.png',
  './icons/icon-192-v61.png',
  './icons/icon-512-v61.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data.type === 'CLEAR_OLD_CACHES') {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
    );
  }
});

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(request, { cache: 'no-store' });
    if (fresh && fresh.ok) await cache.put(request, fresh.clone());
    return fresh;
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const fallback = await caches.match('./index.html');
    if (fallback) return fallback;
    throw error;
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (!isSameOrigin(request)) return;

  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate';
  const isHtml = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/clear-cache.html');
  const isManifest = url.pathname.endsWith('/manifest.webmanifest');
  const isIcon = url.pathname.includes('/icons/');

  if (isNavigation || isHtml || isManifest || isIcon) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
