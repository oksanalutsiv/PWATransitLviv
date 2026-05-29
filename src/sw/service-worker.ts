/// <reference lib="WebWorker" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, matchPrecache } from 'workbox-precaching'
import { registerRoute, setCatchHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { TICKETS_CACHE, API_CACHE, PAGES_CACHE, ticketsUrlPattern, supabaseUrlPattern } from './cacheStrategies'

declare const self: ServiceWorkerGlobalScope

// When the client calls updateSW(true), it sends SKIP_WAITING so the new SW
// activates immediately and the client reloads to pick up fresh assets.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Claim all open clients once this SW activates.
clientsClaim()

// Precache all static assets (JS, CSS, HTML, images) injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)

// ── CacheFirst: ticket pages ────────────────────────────────────────────────
// Tickets are critical for offline use — serve from cache first, refresh in bg
registerRoute(
  ticketsUrlPattern,
  new CacheFirst({
    cacheName: TICKETS_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
      }),
    ],
  })
)

// ── NetworkFirst: Supabase API calls ────────────────────────────────────────
// Always try the network; fall back to cache if offline (max 5 min stale)
registerRoute(
  supabaseUrlPattern,
  new NetworkFirst({
    cacheName: API_CACHE,
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 5, // 5 minutes
      }),
    ],
  })
)

// ── NetworkFirst: all same-origin navigation requests ───────────────────────
// Keeps the app shell fresh; falls back to cached version when offline
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: PAGES_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  })
)

// ── Offline fallback ─────────────────────────────────────────────────────────
// When a navigation request fails entirely (not in cache either), show offline.html
setCatchHandler(async ({ request }) => {
  if (request.destination === 'document') {
    const cached = await matchPrecache('/offline.html')
    return cached ?? new Response('Офлайн', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
  return Response.error()
})
