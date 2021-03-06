var CACHE_NAME = 'MTGStats-cache-v1.2.2';
var urlsToCache = [
  './css/history.css',
  './css/index.css',
  './css/master.css',
  './css/stats.css',
  './img/bg1.webp',
  './img/check.png',
  './img/crown.png',
  './img/favicon.ico',
  './img/infect.png',
  './img/MTG-512x512.png',
  './img/MTG.png',
  './img/undo.png',
  './js/accordion-component.js',
  './js/draw.js',
  './js/history.js',
  './js/popup-component.js',
  './js/slider-component.js',
  './js/stat-component.js',
  './js/stat-scroller-component.js',
  './js/stats.js',
  './mp3/click.mp3',
  './2player.html',
  './4player.html',
  './history.html',
  '.'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
