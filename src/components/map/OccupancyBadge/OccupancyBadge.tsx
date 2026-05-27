import styles from './OccupancyBadge.module.css'

interface OccupancyBadgeProps {
  level: 1 | 2 | 3
}

const LABELS: Record<number, string> = {
  1: 'Вільно',
  2: 'Зайнято',
  3: 'Немає місць',
}

const OccupancyBadge = ({ level }: OccupancyBadgeProps) => (
  <span className={`${styles.badge} ${styles[`level${level}`]}`}>
    <span className={styles.dot} aria-hidden="true" />
    {LABELS[level]}
  </span>
)

export default OccupancyBadge
