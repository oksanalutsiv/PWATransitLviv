import { useState, useEffect, useRef } from 'react'
import styles from './SearchBar.module.css'
import { IconClose } from '@/assets/Icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
}

const SearchBar = ({ value, onChange, onSubmit, placeholder = 'Введіть точку призначення' }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  // Submit on Enter
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && focused) onSubmit()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [focused, onSubmit])

  return (
    <div className={`${styles.wrapper} ${focused ? styles.focused : ''}`}>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        enterKeyHint="search"
      />
      {value && (
        <button
          className={styles.clearBtn}
          onClick={() => { onChange(''); inputRef.current?.focus() }}
          aria-label="Очистити"
          type="button"
        >
          <IconClose size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
