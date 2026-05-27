import { Children, isValidElement } from 'react'
import styles from './SegmentedCard.module.css'

interface SegmentedCardProps {
  children: React.ReactNode
  title?: string
}

/**
 * Organism: white rounded card that wraps SegmentedRows
 * and automatically inserts dividers between them.
 */
const SegmentedCard = ({ children, title }: SegmentedCardProps) => {
  const rows = Children.toArray(children).filter(isValidElement)

  return (
    <div className={styles.card}>
      {title && <p className={styles.title}>{title}</p>}
      {rows.map((row, i) => (
        <div key={i}>
          {i > 0 && <div className={styles.divider} />}
          {row}
        </div>
      ))}
    </div>
  )
}

export default SegmentedCard
