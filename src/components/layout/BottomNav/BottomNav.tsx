import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { useSearchStore } from '@/store/searchSlice'
import { IconMap, IconTicket, IconFeedback, IconProfile } from '@/assets/Icons'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  { to: ROUTES.MAP,        label: 'Карта',   icon: <IconMap /> },
  { to: ROUTES.MY_TICKETS, label: 'Квитки',  icon: <IconTicket /> },
  { to: ROUTES.FEEDBACK,   label: 'Відгуки', icon: <IconFeedback /> },
  { to: ROUTES.PROFILE,    label: 'Профіль', icon: <IconProfile /> },
]

export const BottomNav = () => {
  const { setQuery, setFromQuery, setResults, setTransferPlans } = useSearchStore()

  const handleMapClick = () => {
    setQuery('')
    setFromQuery('')
    setResults([])
    setTransferPlans([])
  }

  return (
    <nav className={styles.nav} aria-label="Головна навігація">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
          aria-label={label}
          {...(to === ROUTES.MAP ? { onClick: handleMapClick } : {})}
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
