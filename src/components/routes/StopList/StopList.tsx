import styles from './StopList.module.css'

export interface StopItem {
  id: string
  name: string
  arrival: string
}

interface StopListProps {
  stops: StopItem[]
}

const StopList = ({ stops }: StopListProps) => (
  <ol className={styles.list}>
    {stops.map((stop, i) => (
      <li key={stop.id} className={styles.item}>
        <div className={styles.timeline}>
          <div className={`${styles.dot} ${i === 0 ? styles.dotFirst : ''}`} />
          {i < stops.length - 1 && <div className={styles.line} />}
        </div>
        <div className={styles.content}>
          <span className={styles.name}>{stop.name}</span>
          <span className={styles.arrival}>{stop.arrival}</span>
        </div>
      </li>
    ))}
  </ol>
)

export default StopList
