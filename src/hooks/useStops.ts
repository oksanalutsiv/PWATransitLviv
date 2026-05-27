import { useState, useEffect } from 'react'
import { fetchStopsByRoute } from '@/lib/supabase/stops'
import type { RouteStop } from '@/lib/supabase/types'

export const useStops = (routeId: string | null) => {
  const [stops, setStops] = useState<RouteStop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!routeId) {
      setStops([])
      return
    }
    setLoading(true)
    setError(null)
    fetchStopsByRoute(routeId).then(({ data, error: err }) => {
      setLoading(false)
      if (err) {
        setError(err.message)
      } else {
        setStops((data as RouteStop[]) ?? [])
      }
    })
  }, [routeId])

  return { stops, loading, error }
}
