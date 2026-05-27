import SearchBar from '@/components/map/SearchBar/SearchBar'
import Divider from '@/components/ui/Divider/Divider'
import styles from './RouteSearchGroup.module.css'

interface RouteSearchGroupProps {
  fromValue: string
  toValue: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onSwap: () => void
  onSubmit: () => void
}

const SwapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 16V4m0 0L3 8m4-4 4 4" />
    <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
  </svg>
)

/** Card with From / To search inputs and an optional swap button. */
const RouteSearchGroup = ({
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  onSwap,
  onSubmit,
}: RouteSearchGroupProps) => {
  const showSwap = fromValue.trim().length > 0 || toValue.trim().length > 0

  return (
    <div className={styles.group}>
      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>Від</span>
          <SearchBar
            value={fromValue}
            onChange={onFromChange}
            onSubmit={onSubmit}
            placeholder="Введіть ваше місцезнаходження"
          />
        </div>
        <Divider />
        <div className={styles.row}>
          <span className={styles.label}>До</span>
          <SearchBar
            value={toValue}
            onChange={onToChange}
            onSubmit={onSubmit}
            placeholder="Введіть точку призначення"
          />
        </div>
      </div>

      {showSwap && (
        <>
          <Divider vertical className={styles.vDivider} />
          <button
            type="button"
            className={styles.swapBtn}
            onClick={onSwap}
            aria-label="Поміняти місцями"
          >
            <SwapIcon />
          </button>
        </>
      )}
    </div>
  )
}

export default RouteSearchGroup
