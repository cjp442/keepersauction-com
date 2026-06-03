const CACHE_NAME = 'keepers-auction-v3'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/launch-guard-v2.js',
  '/public-ready-v1.css',
  '/public-ready-v1.js',
  '/images/coin-eagle.jpg',
  '/images/saloon-main.jpg',
  '/images/saloon-floor-v2.jpg',
  '/images/saloon-wall-v2.jpg',
  '/images/saloon-bar-v2.jpg',
  '/images/saloon-door-v2.jpg',
  '/images/saloon-ceiling-v2.jpg',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(STATIC_ASSETS.map(asset => cache.add(asset)))
    )
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
  if (e.request.method !== 'GET') return

  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response

      return fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('/index.html')
        return caches.match(e.request)
      })
    })
  )
})
