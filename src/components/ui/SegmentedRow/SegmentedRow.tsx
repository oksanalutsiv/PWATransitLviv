import styles from './SegmentedRow.module.css'

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M32.2002 8C33.7634 8 35.0254 9.28697 35.0254 10.8672V46.6064L48.5761 32.8408C49.6795 31.7199 51.4708 31.7199 52.5742 32.8408C53.6757 33.9599 53.6756 35.7734 52.5742 36.8926L34.1992 55.5596C33.0958 56.6805 31.3045 56.6805 30.2011 55.5596L11.8261 36.8926C10.7247 35.7734 10.7246 33.9599 11.8261 32.8408C12.9296 31.7199 14.7207 31.7199 15.8242 32.8408L29.375 46.6064V10.8672C29.375 9.28698 30.637 8.00002 32.2002 8Z" fill="currentColor"/>
  </svg>
)

interface SegmentedRowProps {
  label: string
  /** Trailing text value (data rows) */
  value?: string
  /** Leading icon (navigation rows) */
  icon?: React.ReactNode
  /** Show chevron arrow on the right */
  showArrow?: boolean
  /** Bold label + value (e.g. total row) */
  bold?: boolean
  /** Makes the row a clickable button */
  onClick?: () => void
}

/**
 * Single row inside a SegmentedCard.
 * Renders as a `<button>` when `onClick` is provided, otherwise a `<div>`.
 */
const SegmentedRow = ({ label, value, icon, showArrow = false, bold = false, onClick }: SegmentedRowProps) => {
  const className = [styles.row, bold ? styles.bold : ''].join(' ').trim()

  const content = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      {value && <span className={styles.value}>{value}</span>}
      {showArrow && <span className={styles.arrow}><ArrowIcon /></span>}
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

export default SegmentedRow
