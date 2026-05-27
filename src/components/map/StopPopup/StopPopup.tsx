import { useEffect, useState } from 'react'
import { useArrival } from '@/hooks/useArrival'
import { fetchRoutesByStopId } from '@/lib/supabase/routes'
import type { Stop, Route } from '@/lib/supabase/types'
import styles from './StopPopup.module.css'

interface RouteEntry {
  route: Route & { route_stops: any[] }
  cumulativeSec: number
}

const TYPE_COLORS: Record<string, string> = {
  bus: 'var(--color-bus)',
  tram: 'var(--color-tram)',
  trolleybus: 'var(--color-trolley)',
}

const RouteArrivalItem = ({ entry }: { entry: RouteEntry }) => {
  const minutesAway = useArrival(entry.cumulativeSec)
  const color = TYPE_COLORS[entry.route.transport_type?.name ?? 'bus'] ?? 'var(--color-primary)'
  return (
    <li className={styles.routeItem}>
      <span className={styles.badge} style={{ backgroundColor: color }}>
        {entry.route.number}
      </span>
      <span className={styles.routeName}>{entry.route.name}</span>
      <span className={styles.arrival}>
        {minutesAway != null ? `~${minutesAway} хв` : '…'}
      </span>
    </li>
  )
}

interface StopPopupProps {
  stop: Stop
  onClose: () => void
  onUseAsFrom: (stop: Stop) => void
  onUseAsDest: (stop: Stop) => void
}

const StopPopup = ({ stop, onClose, onUseAsFrom, onUseAsDest }: StopPopupProps) => {
  const [routes, setRoutes] = useState<RouteEntry[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setRoutes(null)
    fetchRoutesByStopId(stop.id).then(({ data }) => {
      setRoutes(data ?? [])
      setLoading(false)
    })
  }, [stop.id])

  return (
    <div className={styles.sheet} role="dialog" aria-label={`Зупинка ${stop.name}`}>
      <div className={styles.handle} />
      <div className={styles.header}>
        <div className={styles.stopIcon} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="8" />
            <line x1="12" y1="16" x2="12" y2="22" />
            <line x1="2" y1="12" x2="8" y2="12" />
            <line x1="16" y1="12" x2="22" y2="12" />
          </svg>
        </div>
        <h3 className={styles.stopName}>{stop.name}</h3>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрити">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.routeList}>
        {loading && (
          <p className={styles.hint}>Завантаження маршрутів…</p>
        )}
        {!loading && routes?.length === 0 && (
          <p className={styles.hint}>Маршрути не знайдено</p>
        )}
        {!loading && routes && routes.length > 0 && (
          <ul className={styles.list}>
            {routes.map(entry => (
              <RouteArrivalItem key={entry.route.id} entry={entry} />
            ))}
          </ul>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={() => onUseAsFrom(stop)}>
          Звідси
        </button>
        <button type="button" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`} onClick={() => onUseAsDest(stop)}>
          Сюди
        </button>
      </div>
    </div>
  )
}

export default StopPopup
