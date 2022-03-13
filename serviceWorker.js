var CACHE_NAME = 'MTGStats-cache-v1.3.1'
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
  './js/audio.js',
  './mp3/click.mp3',
  './2player.html',
  './4player.html',
  './history.html',
  '.',
]

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) return response

      const fetchRequest = event.request.clone()

      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
