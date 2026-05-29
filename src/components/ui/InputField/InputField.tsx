import { useRef, useEffect } from 'react'
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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    // Chrome autofill overrides font-family even with !important in CSS.
    // Detect autofill via the CSS animation trick and set an inline style
    // (highest specificity) so Chrome cannot override the font.
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'autofillStart') {
        input.style.fontFamily = "'Inter', system-ui, sans-serif"
        input.style.fontWeight = '400'
      }
    }
    input.addEventListener('animationstart', handleAnimationStart)
    return () => input.removeEventListener('animationstart', handleAnimationStart)
  }, [])

  return (
    <div className={styles.group}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <input
        ref={inputRef}
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
