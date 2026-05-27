import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authSlice'
import { ROUTES } from './routes'

export const ProtectedRoute = () => {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />
  return <Outlet />
}
