importScripts('./shell-files.js');
const CACHE_PREFIX = self.ContractCockpitShellFiles.cachePrefix;
const CACHE_NAME = self.ContractCockpitShellFiles.cacheName;
const REQUIRED_SHELL_FILES = self.ContractCockpitShellFiles.required;
const OPTIONAL_SHELL_FILES = self.ContractCockpitShellFiles.optional;

const scopedUrl = path => new URL(path, self.registration.scope).href;

async function cacheAsset(cache, path) {
  const url = scopedUrl(path);
  const response = await fetch(url, { cache: 'reload' });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  await cache.put(url, response);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(REQUIRED_SHELL_FILES.map(path => cacheAsset(cache, path)));
    await Promise.allSettled(OPTIONAL_SHELL_FILES.map(path => cacheAsset(cache, path)));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!url.href.startsWith(self.registration.scope)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(scopedUrl('index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    }))
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
