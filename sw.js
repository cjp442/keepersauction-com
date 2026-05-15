const CACHE_NAME = 'coin-keeper-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/images/coin-gold.jpg',
  '/images/saloon-hero.jpg',
  '/images/saloon-floor-v2.jpg',
  '/images/saloon-wall-v2.jpg',
  '/images/saloon-bar-v2.jpg',
  '/images/saloon-door-v2.jpg',
  '/images/saloon-ceiling-v2.jpg',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).catch(() => caches.match('/index.html'))
    })
  )
})
