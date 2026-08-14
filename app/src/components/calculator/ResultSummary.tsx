import type { CalculatorOutcome } from '../../lib/calculators/types'
import type { CalculatorModeConfig } from '../../lib/calculators/modeConfig'
import styles from './ResultSummary.module.css'

interface ResultSummaryProps {
  outcome: CalculatorOutcome
  config: CalculatorModeConfig
}

function formatEuro(value: number): string {
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}

export function ResultSummary({ outcome, config }: ResultSummaryProps) {
  if (!outcome.ok) {
    return (
      <div className={styles.errorBox} role="alert">
        <p className={styles.errorTitle}>Check your inputs</p>
        <ul className={styles.errorList}>
          {outcome.errors.map((err) => (
            <li key={err.field}>{err.message}</li>
          ))}
        </ul>
      </div>
    )
  }

  const { result } = outcome
  const isPositive = result.guaranteedProfit >= 0

  return (
    <div className={styles.summary}>
      <div className={styles.headline}>
        <span className={styles.headlineLabel}>{config.resultLabel}</span>
        <span className={`${styles.headlineValue} ${isPositive ? styles.positive : styles.negative}`}>
          {formatEuro(result.guaranteedProfit)}
          {config.showReturnPct && result.returnPct !== null ? ` (${result.returnPct.toFixed(1)}%)` : null}
        </span>
      </div>

      <dl className={styles.grid}>
        <div className={styles.row}>
          <dt>Lay Stake</dt>
          <dd>{formatEuro(result.layStake)}</dd>
        </div>
        <div className={styles.row}>
          <dt>Liability</dt>
          <dd>{formatEuro(result.liability)}</dd>
        </div>
        <div className={styles.row}>
          <dt>{config.winRowLabel}</dt>
          <dd>{formatEuro(result.backWinProfit)}</dd>
        </div>
        <div className={styles.row}>
          <dt>{config.loseRowLabel}</dt>
          <dd>{formatEuro(result.layWinProfit)}</dd>
        </div>
        {config.showRefundField ? (
          <>
            <div className={styles.row}>
              <dt>Refund Lay Stake</dt>
              <dd>{formatEuro(result.refundLayStake ?? 0)}</dd>
            </div>
            <div className={styles.row}>
              <dt>Refund Liability</dt>
              <dd>{formatEuro(result.refundLiability ?? 0)}</dd>
            </div>
            <div className={styles.row}>
              <dt>Extracted from Refund</dt>
              <dd>{formatEuro(result.refundExtractedValue ?? 0)}</dd>
            </div>
          </>
        ) : null}
      </dl>
    </div>
  )
}
