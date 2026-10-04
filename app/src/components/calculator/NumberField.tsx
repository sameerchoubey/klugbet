import styles from './NumberField.module.css'

interface NumberFieldProps {
  id: string
  label: string
  helperText?: string
  value: number
  onChange: (value: number) => void
  error?: string
  step?: number
  min?: number
  suffix?: string
}

export function NumberField({
  id,
  label,
  helperText,
  value,
  onChange,
  error,
  step = 0.01,
  min,
  suffix,
}: NumberFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id}
          type="number"
          className={styles.input}
          style={suffix ? { paddingRight: 40 } : undefined}
          value={Number.isNaN(value) ? '' : value}
          step={step}
          min={min}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </div>
      {helperText ? <p className={styles.helper}>{helperText}</p> : null}
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
