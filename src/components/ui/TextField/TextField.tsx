import styles from './TextField.module.css'

interface TextFieldProps {
  label?: string
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

const TextField = ({ label, id, value, onChange, placeholder, rows = 4 }: TextFieldProps) => (
  <div className={styles.group}>
    {label && <label className={styles.label} htmlFor={id}>{label}</label>}
    <textarea
      id={id}
      className={styles.textarea}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

export default TextField
