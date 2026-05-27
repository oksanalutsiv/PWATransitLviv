import styles from './PageContainer.module.css'

interface PageContainerProps {
  children: React.ReactNode
  /** Remove default horizontal padding (e.g. for full-bleed maps) */
  noPadding?: boolean
  className?: string
}

/**
 * Standard scrollable page wrapper.
 * Handles horizontal padding and ensures content doesn't hide behind TopBar.
 */
const PageContainer = ({ children, noPadding = false, className }: PageContainerProps) => (
  <div className={`${styles.container} ${noPadding ? styles.noPadding : ''} ${className ?? ''}`}>
    {children}
  </div>
)

export default PageContainer
