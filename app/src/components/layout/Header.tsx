import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
          <circle cx="13" cy="13" r="10" fill="currentColor" opacity="0.55" />
          <circle cx="19" cy="19" r="10" fill="currentColor" />
        </svg>
      </div>
      <div>
        <h1 className={styles.wordmark}>klugbet</h1>
        <p className={styles.tagline}>Matched-Betting Calculators</p>
      </div>
    </header>
  )
}
