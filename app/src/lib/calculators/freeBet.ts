import type { BetCalculatorInputs, CalculatorOutcome } from './types'
import { validateInputs } from './validation'

/** Free bet: stake is NEVER returned, even on a win — only winnings are paid out. */
export function calculateFreeBet(inputs: BetCalculatorInputs): CalculatorOutcome {
  const errors = validateInputs(inputs)
  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const { stake: F, backOdds: Ob, layOdds: Ol, backCommissionPct, layCommissionPct } = inputs
  const cb = backCommissionPct / 100
  const cl = layCommissionPct / 100

  const denom = Ol - cl
  const netWinnings = F * (Ob - 1) * (1 - cb)
  const layStake = netWinnings / denom
  const liability = layStake * (Ol - 1)

  const backWinProfit = netWinnings - liability
  const layWinProfit = layStake * (1 - cl)
  const guaranteedProfit = (backWinProfit + layWinProfit) / 2
  const returnPct = (guaranteedProfit / F) * 100

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
