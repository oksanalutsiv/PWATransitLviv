/**
 * Simulates predicted arrival time in minutes for a given stop on a route.
 * Jitter is deterministic within each 15-second polling slot so that
 * RouteCard (list) and RouteDetailPage show matching values for the same stop.
 */
export const simulateArrival = (avgTravelTimeSec: number): number => {
  const slot = Math.floor(Date.now() / 15000)
  // Deterministic hash: same avgTravelTimeSec + same slot → same jitter
  const seed = ((avgTravelTimeSec * 1009 + slot * 997) >>> 0) % 61
  const jitter = seed - 30 // -30 to +30 seconds
  const totalSec = Math.max(30, avgTravelTimeSec + jitter)
  return Math.ceil(totalSec / 60)
}
