import type { BetCalculatorInputs, CalculatorOutcome } from './types'
import { validateInputs } from './validation'

/**
 * Joker Bet: a real-money back bet that, if it loses, is refunded as a free bet
 * (stake never returned on the refund, same as calculateFreeBet). The refund only
 * materializes on the loss branch, so the two outcomes are NOT equalized — the
 * guaranteed result is the minimum of the two, not their average.
 */
export function calculateJokerBet(inputs: BetCalculatorInputs): CalculatorOutcome {
  const errors = validateInputs(inputs)
  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const { stake: B, backOdds: Ob, layOdds: Ol, backCommissionPct, layCommissionPct, refundAmount: R } = inputs
  const cb = backCommissionPct / 100
  const cl = layCommissionPct / 100
  const denom = Ol - cl

  // Stage 1: hedge the real-money back bet, same math as the Qualifying Bet calculator.
  // The back-side tax applies to the full settlement (stake + winnings) on a win.
  const grossBackPayout = B * Ob * (1 - cb)
  const layStake = grossBackPayout / denom
  const liability = layStake * (Ol - 1)
  const winProfit = grossBackPayout - B - liability
  const loseStageProfit = layStake * (1 - cl) - B

  // Stage 2 (only if the back bet loses): the refund arrives as a free bet (stake never
  // returned), hedged the same way as the Free Bet calculator — so only the winnings
  // portion is taxed, since that IS the entire payout for a stake-not-returned free bet.
  let refundLayStake = 0
  let refundLiability = 0
  let refundExtractedValue = 0
  if (R > 0) {
    const netRefundWinnings = R * (Ob - 1) * (1 - cb)
    refundLayStake = netRefundWinnings / denom
    refundLiability = refundLayStake * (Ol - 1)
    const refundBackWinProfit = netRefundWinnings - refundLiability
    const refundLayWinProfit = refundLayStake * (1 - cl)
    refundExtractedValue = (refundBackWinProfit + refundLayWinProfit) / 2
  }

  const loseProfit = loseStageProfit + refundExtractedValue
  const guaranteedProfit = Math.min(winProfit, loseProfit)
  const returnPct = (guaranteedProfit / B) * 100

  return {
    ok: true,
    result: {
      layStake,
      liability,
      backWinProfit: winProfit,
      layWinProfit: loseProfit,
      guaranteedProfit,
      returnPct,
      refundLayStake,
      refundLiability,
      refundExtractedValue,
    },
  }
}
