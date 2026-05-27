import { useEffect } from 'react'
import { useAuthStore } from '@/store/authSlice'
import { signIn, signUp, signOut, onAuthStateChange } from '@/lib/supabase/auth'

export const useAuth = () => {
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [setUser])

  return {
    user,
    isAuthenticated: user !== null,
    signIn,
    signUp,
    signOut,
  }
}
