import styles from './Toggle.module.css'

interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
  label?: string
  size?: 'sm' | 'lg'
}

/** Accessible on/off toggle switch. */
const Toggle = ({ checked, onChange, disabled = false, label, size = 'sm' }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    className={[
      styles.toggle,
      checked ? styles.on : '',
      disabled ? styles.disabled : '',
      size === 'lg' ? styles.lg : '',
    ].join(' ').trim()}
    onClick={() => !disabled && onChange(!checked)}
  />
)

export default Toggle
