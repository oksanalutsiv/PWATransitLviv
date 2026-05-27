import { useState, useEffect, useCallback } from 'react'
import { usePaymentStore } from '@/store/paymentSlice'
import {
  fetchPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
} from '@/lib/supabase/payments'
import type { PaymentMethod } from '@/lib/supabase/types'

export const usePaymentMethods = (userId: string | null) => {
  const { methods, selectedMethodId, setMethods, setSelectedMethodId } = usePaymentStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchPaymentMethods(userId)
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      const list = (data as PaymentMethod[]) ?? []
      setMethods(list)
      const defaultMethod = list.find((m) => m.is_default)
      if (defaultMethod) setSelectedMethodId(defaultMethod.id)
    }
  }, [userId, setMethods, setSelectedMethodId])

  useEffect(() => {
    load()
  }, [load])

  const add = useCallback(
    async (type: 'bank_card' | 'leocard', label: string) => {
      if (!userId) return { error: 'Not authenticated' }
      const { data, error: err } = await addPaymentMethod({ user_id: userId, type, label })
      if (!err && data) await load()
      return { data, error: err?.message ?? null }
    },
    [userId, load]
  )

  const setDefault = useCallback(
    async (methodId: string) => {
      if (!userId) return
      await setDefaultPaymentMethod(userId, methodId)
      setSelectedMethodId(methodId)
      await load()
    },
    [userId, setSelectedMethodId, load]
  )

  const remove = useCallback(
    async (methodId: string) => {
      await deletePaymentMethod(methodId)
      await load()
    },
    [load]
  )

  return {
    methods,
    selectedMethodId,
    loading,
    error,
    add,
    setDefault,
    remove,
    refresh: load,
  }
}
