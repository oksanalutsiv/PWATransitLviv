import { useLocation } from 'react-router-dom'
import { BottomNav } from '../BottomNav/BottomNav'
import styles from './AppShell.module.css'

interface AppShellProps {
  children: React.ReactNode
}

/** Root layout wrapper. Renders page content above the persistent BottomNav. */
const AppShell = ({ children }: AppShellProps) => {
  const { pathname } = useLocation()

  // Hide bottom nav on auth screens and splash
  const hideNav = pathname.startsWith('/auth') || pathname === '/'
  // Map page uses its own full-screen background
  const isMapPage = pathname === '/map'

  return (
    <div className={`${styles.shell} ${isMapPage ? styles.noGradient : ''}`}>
      <main className={isMapPage ? styles.contentFull : styles.content}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}

export default AppShell
