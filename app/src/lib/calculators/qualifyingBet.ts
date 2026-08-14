import type { BetCalculatorInputs, CalculatorOutcome } from './types'
import { validateInputs } from './validation'

export function calculateQualifyingBet(inputs: BetCalculatorInputs): CalculatorOutcome {
  const errors = validateInputs(inputs)
  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const { stake: B, backOdds: Ob, layOdds: Ol, backCommissionPct, layCommissionPct } = inputs
  const cb = backCommissionPct / 100
  const cl = layCommissionPct / 100

  const denom = Ol - cl
  // German Wettsteuer-style tax applies to the FULL settlement (stake + winnings), not just the
  // profit — whether framed as "deducted from the stake before the bet is placed" or "deducted
  // from the payout after settlement", both land on the same net payout: B * Ob * (1 - cb).
  const grossBackPayout = B * Ob * (1 - cb)
  const layStake = grossBackPayout / denom
  const liability = layStake * (Ol - 1)

  const backWinProfit = grossBackPayout - B - liability
  const layWinProfit = layStake * (1 - cl) - B
  const guaranteedProfit = (backWinProfit + layWinProfit) / 2
  const returnPct = (guaranteedProfit / B) * 100

  return {
    ok: true,
    result: {
      layStake,
      liability,
      backWinProfit,
      layWinProfit,
      guaranteedProfit,
      returnPct,
    },
  }
}
