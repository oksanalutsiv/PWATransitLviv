import styles from './QuantityCounter.module.css'

const MinusSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const PlusSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8H14M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

interface QuantityCounterProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}

/** Round −/+ stepper for numeric quantities. */
const QuantityCounter = ({ value, onChange, min = 0, max = 10 }: QuantityCounterProps) => (
  <div className={styles.counter}>
    <button
      type="button"
      className={styles.btn}
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      aria-label="Зменшити"
    >
      <MinusSvg />
    </button>
    <span className={styles.val}>{value}</span>
    <button
      type="button"
      className={styles.btn}
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      aria-label="Збільшити"
    >
      <PlusSvg />
    </button>
  </div>
)

export default QuantityCounter
