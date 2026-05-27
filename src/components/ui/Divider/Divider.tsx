import styles from './Divider.module.css'

interface DividerProps {
  className?: string
  vertical?: boolean
}

const Divider = ({ className, vertical }: DividerProps) =>
  vertical
    ? <span className={`${styles.vertical}${className ? ` ${className}` : ''}`} aria-hidden="true" />
    : <hr className={`${styles.divider}${className ? ` ${className}` : ''}`} />

export default Divider
