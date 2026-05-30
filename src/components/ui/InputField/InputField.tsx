import styles from './InputField.module.css'

interface InputFieldProps {
  label?: string
  id?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
  readOnly?: boolean
}

const InputField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  readOnly = false,
}: InputFieldProps) => {
  return (
    <div className={styles.group}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        className={`${styles.input} ${readOnly ? styles.readOnly : ''}`}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        readOnly={readOnly}
      />
    </div>
  )
}

export default InputField
