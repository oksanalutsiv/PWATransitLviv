import { useState, useCallback } from 'react'
import { useSearchStore } from '@/store/searchSlice'
import { searchRoutes, fetchRouteById } from '@/lib/supabase/routes'
import type { Route } from '@/lib/supabase/types'

export const useRoutes = () => {
  const { query, inclusiveOnly, results, setQuery, setInclusiveOnly, setResults } = useSearchStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (q: string, inclusive: boolean) => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await searchRoutes(q, inclusive)
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setResults((data as Route[]) ?? [])
    }
  }, [setResults])

  const getRouteById = useCallback(async (id: string): Promise<Route | null> => {
    const { data, error: err } = await fetchRouteById(id)
    if (err) return null
    return data as Route
  }, [])

  return {
    query,
    inclusiveOnly,
    results,
    loading,
    error,
    setQuery,
    setInclusiveOnly,
    search,
    getRouteById,
  }
}
