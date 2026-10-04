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

function MeterRow({ label, value, maxAbs }: { label: string; value: number; maxAbs: number }) {
  const isPositive = value >= 0
  const widthPct = maxAbs > 0 ? Math.min(100, (Math.abs(value) / maxAbs) * 50) : 0

  return (
    <div className={styles.meterRow}>
      <span className={styles.meterLabel}>{label}</span>
      <div className={styles.meterTrack}>
        <div className={styles.meterBaseline} />
        <div
          className={`${styles.meterBar} ${isPositive ? styles.barPositive : styles.barNegative}`}
          style={
            isPositive
              ? { left: '50%', width: `${widthPct}%`, borderRadius: '0 4px 4px 0' }
              : { right: '50%', width: `${widthPct}%`, borderRadius: '4px 0 0 4px' }
          }
        />
      </div>
      <span className={`${styles.meterValue} ${isPositive ? styles.positive : styles.negative}`}>
        {formatEuro(value)}
      </span>
    </div>
  )
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
  const meterMax = Math.max(Math.abs(result.backWinProfit), Math.abs(result.layWinProfit), 0.01)

  return (
    <div className={styles.summary}>
      <div className={styles.headline}>
        <span className={styles.headlineLabel}>{config.resultLabel}</span>
        <span className={`${styles.headlineValue} ${isPositive ? styles.positive : styles.negative}`}>
          {formatEuro(result.guaranteedProfit)}
        </span>
        {config.showReturnPct && result.returnPct !== null ? (
          <span className={styles.headlinePct}>{result.returnPct.toFixed(1)}% of stake</span>
        ) : null}
      </div>

      <div className={styles.meter}>
        <MeterRow label={config.winRowLabel} value={result.backWinProfit} maxAbs={meterMax} />
        <MeterRow label={config.loseRowLabel} value={result.layWinProfit} maxAbs={meterMax} />
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
        {config.showRefundField ? (
          <>
            <div className={styles.subheading}>Refund breakdown</div>
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
