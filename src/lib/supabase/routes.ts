import { supabase } from './client'
import type { Route, TransferPlan } from './types'

export const fetchRoutes = () =>
  supabase.from('routes').select('*, transport_type:transport_types(*)').eq('is_active', true)

export const fetchRouteById = (id: string) =>
  supabase.from('routes').select('*, transport_type:transport_types(*), route_stops(*, stop:stops(*))').eq('id', id).single()

/** Returns up to 4 active routes that serve the given stop, each paired with
 *  the cumulative avg_travel_time_sec from the route's first stop to this stop
 *  (used as the seed for simulateArrival). */
export const fetchRoutesByStopId = async (stopId: string): Promise<{
  data: Array<{ route: Route & { route_stops: any[] }; cumulativeSec: number }> | null
  error: any
}> => {
  // Step 1: find which routes serve this stop
  const { data: membership, error: e1 } = await supabase
    .from('route_stops')
    .select('route_id, stop_order')
    .eq('stop_id', stopId)
  if (!membership || e1) return { data: null, error: e1 }

  const routeIds = [...new Set(membership.map((m: any) => m.route_id as string))].slice(0, 4)
  if (routeIds.length === 0) return { data: [], error: null }

  // Step 2: fetch those routes with their full stop list for cumulative calculation
  const { data: routes, error: e2 } = await supabase
    .from('routes')
    .select('*, transport_type:transport_types(*), route_stops(stop_id, stop_order, avg_travel_time_sec, stop:stops(name))')
    .in('id', routeIds)
    .eq('is_active', true)
  if (!routes || e2) return { data: null, error: e2 }

  // Step 3: compute cumulative sec to this stop for each route
  const result = routes.map((route: any) => {
    const sorted = ((route.route_stops ?? []) as any[])
      .slice().sort((a: any, b: any) => a.stop_order - b.stop_order)
    const idx = sorted.findIndex((rs: any) => rs.stop_id === stopId)
    const cumulativeSec = idx !== -1
      ? sorted.slice(0, idx + 1).reduce((sum: number, rs: any) => sum + rs.avg_travel_time_sec, 0)
      : (sorted[0]?.avg_travel_time_sec ?? 60)
    return { route: route as Route & { route_stops: any[] }, cumulativeSec }
  })

  return { data: result, error: null }
}

// Search routes by name OR by having a stop whose name includes the query.
export const searchRoutes = async (query: string, inclusiveOnly: boolean) => {
  let q = supabase
    .from('routes')
    .select('*, transport_type:transport_types(*), route_stops(stop_order, stop_id, avg_travel_time_sec, stop:stops(name))')
    .eq('is_active', true)
  if (inclusiveOnly) q = q.eq('is_inclusive', true)

  const { data, error } = await q
  if (!data) return { data: null, error }

  const qLow = query.toLowerCase().trim()
  const filtered = data.filter((route: any) => {
    if (route.name.toLowerCase().includes(qLow)) return true
    return (route.route_stops ?? []).some((rs: any) =>
      rs.stop?.name?.toLowerCase().includes(qLow)
    )
  })

  return { data: filtered, error: null }
}

type RS = { stop_order: number; stop_id: string; avg_travel_time_sec: number; stop: { name: string; lat?: number; lng?: number } | null }

// Haversine distance in metres between two lat/lng points
const haversineM = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Maximum walking distance (metres) to consider two stops as a walkable transfer
const WALK_RADIUS_M = 350

// Search routes that pass through both FROM and TO stops (in order).
// Returns direct routes plus 1-transfer journey plans.
export const searchRoutesByStops = async (
  from: string,
  to: string,
  inclusiveOnly: boolean
): Promise<{ data: any[] | null; transfers: TransferPlan[]; error: any }> => {
  let q = supabase
    .from('routes')
    .select('*, transport_type:transport_types(*), route_stops(stop_order, stop_id, avg_travel_time_sec, stop:stops(name, lat, lng))')
    .eq('is_active', true)
  if (inclusiveOnly) q = q.eq('is_inclusive', true)

  const { data, error } = await q
  if (error) console.error('[searchRoutesByStops] Supabase error:', error)
  if (!data) return { data: null, transfers: [], error }

  console.log('[searchRoutesByStops] routes fetched:', data.length)
  console.log('[searchRoutesByStops] first route stops sample:', JSON.stringify(data[0]?.route_stops?.slice(0,2)))
  console.log('[searchRoutesByStops] fromLow:', from.toLowerCase().trim(), '| toLow:', to.toLowerCase().trim())

  const fromLow = from.toLowerCase().trim()
  const toLow   = to.toLowerCase().trim()

  // Always sort stops by stop_order so .find() returns the correct first/last match
  const getStops = (route: any): RS[] =>
    ((route.route_stops ?? []) as RS[]).slice().sort((a, b) => a.stop_order - b.stop_order)

  // Direct: single route contains both FROM (before TO)
  const direct = data.filter((route: any) => {
    const stops = getStops(route)
    const fromStop = stops.find(rs => rs.stop?.name?.toLowerCase().includes(fromLow))
    const toStop   = stops.find(rs => rs.stop?.name?.toLowerCase().includes(toLow))
    if (!fromStop || !toStop) return false
    return fromStop.stop_order < toStop.stop_order
  })

  // 1-transfer: R1 has FROM → R1 shares a stop with R2 → R2 has TO
  // Matching is done by stop_id (exact) OR stop name (GTFS uses different IDs
  // for inbound/outbound stops at the same location, so name fallback is needed)
  const transfers: TransferPlan[] = []
  for (const r1 of data) {
    const s1 = getStops(r1)
    const fromStop = s1.find(rs => rs.stop?.name?.toLowerCase().includes(fromLow))
    if (!fromStop) continue
    // Stops on R1 after fromStop (possible transfer points)
    const r1AfterIds   = new Map<string, string>()   // stop_id   → stop name
    const r1AfterNames  = new Map<string, string>()   // stop name (lower) → stop name (display)
    // For proximity matching: keep full stop info after FROM on R1
    const r1AfterCoords: Array<{ sid: string; name: string; lat: number; lng: number }> = []
    for (const rs of s1) {
      if (rs.stop_order > fromStop.stop_order && rs.stop?.name) {
        r1AfterIds.set(rs.stop_id, rs.stop.name)
        r1AfterNames.set(rs.stop.name.toLowerCase(), rs.stop.name)
        if (rs.stop.lat != null && rs.stop.lng != null) {
          r1AfterCoords.push({ sid: rs.stop_id, name: rs.stop.name, lat: rs.stop.lat, lng: rs.stop.lng })
        }
      }
    }
    if (r1AfterIds.size === 0) continue

    for (const r2 of data) {
      if (r2.id === r1.id) continue
      const s2 = getStops(r2)
      const toStop = s2.find(rs => rs.stop?.name?.toLowerCase().includes(toLow))
      if (!toStop) continue
      const beforeTo = s2.filter(rs => rs.stop_order < toStop.stop_order)

      // 1. Exact stop_id match
      let transferStop = beforeTo.find(rs => r1AfterIds.has(rs.stop_id))
      let walkToStopName: string | undefined

      // 2. Same stop name (GTFS directional IDs)
      if (!transferStop) {
        transferStop = beforeTo.find(rs => {
          const nameLow = rs.stop?.name?.toLowerCase() ?? ''
          return nameLow.length > 0 && r1AfterNames.has(nameLow)
        })
      }

      // 3. Proximity walk: a stop on R1 is within WALK_RADIUS_M of a stop on R2
      if (!transferStop && r1AfterCoords.length > 0) {
        for (const s2Stop of beforeTo) {
          if (!s2Stop.stop?.lat || !s2Stop.stop?.lng) continue
          const nearest = r1AfterCoords.find(c =>
            haversineM(c.lat, c.lng, s2Stop.stop!.lat!, s2Stop.stop!.lng!) <= WALK_RADIUS_M
          )
          if (nearest) {
            transferStop  = s2Stop
            walkToStopName = s2Stop.stop?.name ?? ''
            // transferStopName will be the R1 alight stop; walkToStopName is the R2 board stop
            break
          }
        }
      }

      if (transferStop) {
        const alreadyDirect = direct.some((d: any) => d.id === r1.id && d.id === r2.id)
        if (!alreadyDirect) {
          const displayName =
            (r1AfterIds.get(transferStop.stop_id) ??
            r1AfterNames.get(transferStop.stop?.name?.toLowerCase() ?? '') ??
            (walkToStopName
              // For walk transfers, find the nearest R1 stop name to display as alight point
              ? r1AfterCoords.reduce((best, c) => {
                  const d = haversineM(c.lat, c.lng, transferStop!.stop!.lat!, transferStop!.stop!.lng!)
                  return d < best.d ? { name: c.name, d } : best
                }, { name: '', d: Infinity }).name
              : '')) ||
            (transferStop.stop?.name ?? '')
          transfers.push({
            leg1: r1,
            transferStopName: displayName,
            walkToStopName: walkToStopName !== displayName ? walkToStopName : undefined,
            leg2: r2,
          })
        }
        break // one transfer per r1 leg
      }
    }
  }

  console.log('[searchRoutesByStops] direct:', direct.length, 'transfers:', transfers.length,
    transfers.map(t => `${t.leg1.number}→${t.leg2.number} via ${t.transferStopName}`))

  return { data: direct, transfers, error: null }
}
