import type { Route } from '@/lib/supabase/types'
import OccupancyBadge from '@/components/map/OccupancyBadge/OccupancyBadge'
import TransportBadge from '@/components/routes/TransportBadge/TransportBadge'
import type { TransportType } from '@/components/routes/TransportBadge/TransportBadge'
import { IconArrow, IconAccessibility } from '@/assets/Icons'
import styles from './RouteCard.module.css'

interface RouteCardProps {
  route: Route
  onClick: (route: Route) => void
  minutesAway?: number | null
}

const TYPE_LABELS: Record<string, string> = {
  bus: 'Автобус',
  tram: 'Трамвай',
  trolleybus: 'Тролейбус',
}


const RouteCard = ({ route, onClick, minutesAway }: RouteCardProps) => {
  const typeName = (route.transport_type?.name ?? 'bus') as TransportType

  return (
    <button type="button" className={styles.card} onClick={() => onClick(route)}>
      <div className={styles.left}>
        <TransportBadge type={typeName} number={route.number} />
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{route.name}</span>
        <div className={styles.meta}>
          <span className={styles.type}>{TYPE_LABELS[typeName]}</span>
          {route.is_inclusive && (
            <IconAccessibility size={14} className={styles.accessibilityIcon} />
          )}
          {route.avg_rating > 0 && (
            <span className={styles.rating}>★ {route.avg_rating.toFixed(1)}</span>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <OccupancyBadge level={route.occupancy_level} />
        <div className={styles.arrivalRow}>
          {minutesAway != null && (
            <span className={styles.arrival} aria-label={`Прибуття через ${minutesAway} хв`}>
              ~{minutesAway} хв
            </span>
          )}
          <IconArrow size={16} className={styles.rightArrow} />
        </div>
      </div>
    </button>
  )
}

export default RouteCard
