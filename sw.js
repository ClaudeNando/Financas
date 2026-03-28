const CACHE = 'casafinanca-v14';
const ASSETS = [
  '/Financas/',
  '/Financas/index.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first: always try network, fall back to cache only when offline
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Save fresh copy to cache
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request).then(cached =>
        cached || caches.match('/Financas/index.html')
      ))
  );
});
