import { useEffect } from 'react'
import { AppRouter } from '@/router/AppRouter'
import { onAuthStateChange } from '@/lib/supabase/auth'
import { useAuthStore } from '@/store/authSlice'
import '@/tokens/index.css'
import '@/styles/global.css'
import '@/styles/breakpoints.css'
import '@/styles/utilities.css'

const App = () => {
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [setUser])

  return <AppRouter />
}

export default App
