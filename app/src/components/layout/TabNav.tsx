import type { CalculatorMode } from '../../lib/calculators/types'
import styles from './TabNav.module.css'

const TAB_ORDER: CalculatorMode[] = ['qualifying', 'freeBet', 'jokerBet']

const TAB_SHORT_LABEL: Record<CalculatorMode, string> = {
  qualifying: 'Qualifying Bet',
  freeBet: 'Free Bet',
  jokerBet: 'Joker Bet',
}

interface TabNavProps {
  active: CalculatorMode
  onChange: (mode: CalculatorMode) => void
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className={styles.tablist} role="tablist" aria-label="Calculator selection">
      {TAB_ORDER.map((mode) => {
        const isActive = mode === active
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            id={`tab-${mode}`}
            aria-selected={isActive}
            aria-controls={`panel-${mode}`}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onChange(mode)}
          >
            {TAB_SHORT_LABEL[mode]}
          </button>
        )
      })}
    </div>
  )
}
