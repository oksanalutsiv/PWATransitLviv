// Cache names — bump the version suffix to bust caches on breaking changes
export const TICKETS_CACHE = 'tickets-v1'
export const API_CACHE = 'supabase-api-v1'
export const PAGES_CACHE = 'pages-v1'

// URL patterns used in both the service worker and vite.config
export const ticketsUrlPattern = /\/tickets/
export const supabaseUrlPattern = /supabase\.co/
