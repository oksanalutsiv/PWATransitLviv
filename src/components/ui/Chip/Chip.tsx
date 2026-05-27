import styles from './Chip.module.css'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

const Chip = ({ label, selected = false, onClick }: ChipProps) => (
  <span
    role="option"
    aria-selected={selected}
    tabIndex={0}
    className={`${styles.chip} ${selected ? styles.selected : ''}`}
    onClick={onClick}
    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onClick?.()}
  >
    {label}
  </span>
)

export default Chip
