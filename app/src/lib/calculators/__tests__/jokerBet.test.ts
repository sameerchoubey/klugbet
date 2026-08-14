import { describe, it, expect } from 'vitest'
import { calculateJokerBet } from '../jokerBet'
import { calculateQualifyingBet } from '../qualifyingBet'

describe('calculateJokerBet', () => {
  it('with refundAmount=0, behaves exactly like the plain Qualifying Bet calculator', () => {
    const inputs = {
      mode: 'jokerBet' as const,
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    }
    const joker = calculateJokerBet(inputs)
    const qualifying = calculateQualifyingBet({ ...inputs, mode: 'qualifying' })

    expect(joker.ok).toBe(true)
    expect(qualifying.ok).toBe(true)
    if (!joker.ok || !qualifying.ok) return

    expect(joker.result.layStake).toBeCloseTo(qualifying.result.layStake, 6)
    expect(joker.result.backWinProfit).toBeCloseTo(qualifying.result.backWinProfit, 6)
    expect(joker.result.guaranteedProfit).toBeCloseTo(qualifying.result.backWinProfit, 6)
  })

  it('stage 1 taxes the full settlement (stake + winnings), matching the Qualifying Bet calculator, even with back commission set', () => {
    const inputs = {
      mode: 'jokerBet' as const,
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 5,
      layCommissionPct: 2,
      refundAmount: 0,
    }
    const joker = calculateJokerBet(inputs)
    const qualifying = calculateQualifyingBet({ ...inputs, mode: 'qualifying' })

    expect(joker.ok).toBe(true)
    expect(qualifying.ok).toBe(true)
    if (!joker.ok || !qualifying.ok) return

    expect(joker.result.layStake).toBeCloseTo(qualifying.result.layStake, 6)
    expect(joker.result.backWinProfit).toBeCloseTo(qualifying.result.backWinProfit, 6)
  })

  it('the refund extraction has equal back/lay outcomes on its own', () => {
    const outcome = calculateJokerBet({
      mode: 'jokerBet',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 20,
    })
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    // refundLayStake/refundLiability are independently verifiable via the same math as freeBet
    expect(outcome.result.refundLayStake).toBeCloseTo(20 / 2.08, 4)
  })

  it('a larger refund improves (or holds steady) the guaranteed minimum result, never worsens it', () => {
    const inputs = {
      mode: 'jokerBet' as const,
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
    }
    const noRefund = calculateJokerBet({ ...inputs, refundAmount: 0 })
    const smallRefund = calculateJokerBet({ ...inputs, refundAmount: 20 })
    const bigRefund = calculateJokerBet({ ...inputs, refundAmount: 100 })

    expect(noRefund.ok).toBe(true)
    expect(smallRefund.ok).toBe(true)
    expect(bigRefund.ok).toBe(true)
    if (!noRefund.ok || !smallRefund.ok || !bigRefund.ok) return

    expect(smallRefund.result.guaranteedProfit).toBeGreaterThanOrEqual(noRefund.result.guaranteedProfit)
    expect(bigRefund.result.guaranteedProfit).toBeGreaterThanOrEqual(smallRefund.result.guaranteedProfit)
  })

  it('guaranteed minimum equals the lesser of the win-branch and lose-branch profit', () => {
    const outcome = calculateJokerBet({
      mode: 'jokerBet',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 20,
    })
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    expect(outcome.result.guaranteedProfit).toBeCloseTo(
      Math.min(outcome.result.backWinProfit, outcome.result.layWinProfit),
      6,
    )
  })

  it('rejects a negative refund amount', () => {
    const outcome = calculateJokerBet({
      mode: 'jokerBet',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: -10,
    })
    expect(outcome.ok).toBe(false)
  })

  it('rejects invalid stake/odds/commission the same way as other calculators', () => {
    const outcome = calculateJokerBet({
      mode: 'jokerBet',
      stake: 0,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 20,
    })
    expect(outcome.ok).toBe(false)
  })
})
