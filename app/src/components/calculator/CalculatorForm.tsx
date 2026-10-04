import { useMemo, useState } from 'react'
import { calculate } from '../../lib/calculators'
import { MODE_CONFIG } from '../../lib/calculators/modeConfig'
import type { CalculatorMode } from '../../lib/calculators/types'
import { NumberField } from './NumberField'
import { ResultSummary } from './ResultSummary'
import styles from './CalculatorForm.module.css'

interface CalculatorFormProps {
  mode: CalculatorMode
}

export function CalculatorForm({ mode }: CalculatorFormProps) {
  const config = MODE_CONFIG[mode]

  const [stake, setStake] = useState(100)
  const [backOdds, setBackOdds] = useState(2)
  const [layOdds, setLayOdds] = useState(2.1)
  const [backCommissionPct, setBackCommissionPct] = useState(0)
  const [layCommissionPct, setLayCommissionPct] = useState(0)
  const [refundAmount, setRefundAmount] = useState(20)

  const outcome = useMemo(
    () => calculate({ mode, stake, backOdds, layOdds, backCommissionPct, layCommissionPct, refundAmount }),
    [mode, stake, backOdds, layOdds, backCommissionPct, layCommissionPct, refundAmount],
  )

  const fieldErrors = outcome.ok
    ? {}
    : Object.fromEntries(outcome.errors.filter((e) => e.field !== 'general').map((e) => [e.field, e.message]))

  return (
    <section className={styles.layout}>
      <div className={styles.formColumn}>
        <h2 className={styles.title}>{config.title}</h2>
        <p className={styles.description}>{config.description}</p>

        <div className={styles.card}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Your Bet</span>
            <NumberField
              id={`${mode}-stake`}
              label={config.stakeLabel}
              helperText={config.stakeHelperText}
              value={stake}
              onChange={setStake}
              min={0}
              suffix="€"
              error={fieldErrors.stake}
            />
            <div className={styles.fieldRow}>
              <NumberField
                id={`${mode}-back-odds`}
                label="Back Odds (decimal)"
                value={backOdds}
                onChange={setBackOdds}
                min={1.01}
                error={fieldErrors.backOdds}
              />
              <NumberField
                id={`${mode}-back-commission`}
                label="Back Commission / Tax"
                helperText="Tax on the full settlement (stake + winnings) on a win — e.g. German Wettsteuer. Leave at 0% if odds already include it."
                value={backCommissionPct}
                onChange={setBackCommissionPct}
                min={0}
                step={0.1}
                suffix="%"
                error={fieldErrors.backCommissionPct}
              />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Your Hedge</span>
            <div className={styles.fieldRow}>
              <NumberField
                id={`${mode}-lay-odds`}
                label="Lay Odds (decimal)"
                value={layOdds}
                onChange={setLayOdds}
                min={1.01}
                error={fieldErrors.layOdds}
              />
              <NumberField
                id={`${mode}-lay-commission`}
                label="Exchange Commission"
                value={layCommissionPct}
                onChange={setLayCommissionPct}
                min={0}
                step={0.1}
                suffix="%"
                error={fieldErrors.layCommissionPct}
              />
            </div>
          </div>

          {config.showRefundField ? (
            <>
              <div className={styles.divider} />
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Refund</span>
                <NumberField
                  id={`${mode}-refund`}
                  label={config.refundLabel ?? 'Refund Amount (€)'}
                  helperText={config.refundHelperText}
                  value={refundAmount}
                  onChange={setRefundAmount}
                  min={0}
                  suffix="€"
                  error={fieldErrors.refundAmount}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className={styles.resultColumn}>
        <ResultSummary outcome={outcome} config={config} />
      </div>
    </section>
  )
}
