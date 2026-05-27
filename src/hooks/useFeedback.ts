import { useState, useCallback } from 'react'
import { submitRating, submitComplaint } from '@/lib/supabase/feedback'

export const useFeedback = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const sendRating = useCallback(
    async (payload: {
      user_id: string | null
      route_id: string
      stars: number
      comment: string
    }) => {
      setLoading(true)
      setError(null)
      const { error: err } = await submitRating(payload)
      setLoading(false)
      if (err) {
        setError(err.message)
        return false
      }
      setDone(true)
      return true
    },
    []
  )

  const sendComplaint = useCallback(
    async (payload: {
      user_id: string | null
      route_id: string | null
      tag_ids: number[]
    }) => {
      setLoading(true)
      setError(null)
      const { error: err } = await submitComplaint(payload)
      setLoading(false)
      if (err) {
        setError(err.message)
        return false
      }
      setDone(true)
      return true
    },
    []
  )

  const reset = useCallback(() => {
    setDone(false)
    setError(null)
  }, [])

  return { loading, error, done, sendRating, sendComplaint, reset }
}
