const CACHE_NAME = 'roro-ai-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/roro ai.f',
  '/CORTIS.mp3'
];

// تثبيت ملفات الموقع في الهاتف ليعمل بدون إنترنت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// استخدام الملفات المحفوظة عند فتح التطبيق
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
