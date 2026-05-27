import { useState, useEffect, useRef } from 'react'
import { simulateArrival } from '@/utils/simulateArrival'

/**
 * Polls every `intervalMs` ms and returns a simulated arrival time in minutes
 * based on the stop's avg_travel_time_sec.
 */
export const useArrival = (avgTravelTimeSec: number | null, intervalMs = 15000) => {
  const [minutesAway, setMinutesAway] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (avgTravelTimeSec === null) {
      setMinutesAway(null)
      return
    }

    // Compute immediately, then poll
    setMinutesAway(simulateArrival(avgTravelTimeSec))

    intervalRef.current = setInterval(() => {
      setMinutesAway(simulateArrival(avgTravelTimeSec))
    }, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [avgTravelTimeSec, intervalMs])

  return minutesAway
}
