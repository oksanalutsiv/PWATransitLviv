import styles from './TransportBadge.module.css'

export type TransportType = 'bus' | 'tram' | 'trolleybus'

const TYPE_COLORS: Record<TransportType, string> = {
  bus:        'var(--color-bus)',
  tram:       'var(--color-tram)',
  trolleybus: 'var(--color-trolley)',
}

// Strip leading zeros for routes ending with a letter, e.g. А06А → А6А
const formatRouteNumber = (n: string) =>
  /[A-Za-zА-Яа-яҐґЄєІіЇї]$/.test(n) ? n.replace(/^([A-Za-zА-Яа-яҐґЄєІіЇї]*)0+(\d)/, '$1$2') : n

interface TransportBadgeProps {
  type: TransportType
  number: string
}

const TransportBadge = ({ type, number }: TransportBadgeProps) => (
  <div
    className={styles.badge}
    style={{ backgroundColor: TYPE_COLORS[type] }}
    aria-label={`Маршрут ${number}`}
  >
    {formatRouteNumber(number)}
  </div>
)

export default TransportBadge
