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
    const setFont = () => {
      input.style.fontFamily = "'Inter', system-ui, sans-serif"
      input.style.fontWeight = '400'
    }
    // Fire immediately and at intervals to cover Chrome's autofill window
    setFont()
    const t1 = setTimeout(setFont, 50)
    const t2 = setTimeout(setFont, 200)
    const t3 = setTimeout(setFont, 500)
    const t4 = setTimeout(setFont, 1000)
    // animationstart fires the exact moment the browser applies autofill styles
    const onAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'autofillDetect') setFont()
    }
    input.addEventListener('animationstart', onAnimationStart)
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
      input.removeEventListener('animationstart', onAnimationStart)
    }
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
