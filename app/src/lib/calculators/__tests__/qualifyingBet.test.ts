import { describe, it, expect } from 'vitest'
import { calculateQualifyingBet } from '../qualifyingBet'

describe('calculateQualifyingBet', () => {
  it('matches the worked example (B=100, Ob=2.0, Ol=2.1, layCommission=2%, no back commission)', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })

    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return

    expect(outcome.result.layStake).toBeCloseTo(96.15, 1)
    expect(outcome.result.backWinProfit).toBeCloseTo(-5.77, 1)
    expect(outcome.result.layWinProfit).toBeCloseTo(-5.77, 1)
    expect(outcome.result.guaranteedProfit).toBeCloseTo(-5.77, 1)
  })

  it('accounts for back-side commission/tax on the full settlement (stake + winnings), e.g. German Wettsteuer', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 5,
      layCommissionPct: 2,
      refundAmount: 0,
    })

    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return

    expect(outcome.result.layStake).toBeCloseTo(91.35, 1)
    expect(outcome.result.backWinProfit).toBeCloseTo(-10.48, 1)
    expect(outcome.result.layWinProfit).toBeCloseTo(-10.48, 1)
  })

  it('taxes the full payout (stake + winnings), not just the winnings portion', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 5,
      layCommissionPct: 0,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    // lay stake should match B * Ob * (1 - cb) / layOdds, i.e. tax applied to the whole payout
    expect(outcome.result.layStake).toBeCloseTo((100 * 2.0 * 0.95) / 2.1, 6)
  })

  it('produces (approximately) equal outcomes regardless of which side wins', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 50,
      backOdds: 3.5,
      layOdds: 3.6,
      backCommissionPct: 0,
      layCommissionPct: 5,
      refundAmount: 0,
    })

    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    expect(outcome.result.backWinProfit).toBeCloseTo(outcome.result.layWinProfit, 6)
  })

  it('rejects back odds <= 1', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 1,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(false)
  })

  it('rejects zero or negative stake', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 0,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(false)
  })

  it('rejects commission outside [0, 100] for either back or lay', () => {
    const badBack = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: -1,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    const badLay = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 101,
      refundAmount: 0,
    })
    expect(badBack.ok).toBe(false)
    expect(badLay.ok).toBe(false)
  })

  it('guards against a near-zero divisor (extreme low lay odds + high commission)', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 1.00005,
      backCommissionPct: 0,
      layCommissionPct: 100,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(false)
  })

  it('handles zero commission on both sides by simplifying denom to layOdds', () => {
    const outcome = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.1,
      backCommissionPct: 0,
      layCommissionPct: 0,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    expect(outcome.result.layStake).toBeCloseTo((100 * 2.0) / 2.1, 6)
  })

  it('requires less lay stake as lay odds increase (monotonicity)', () => {
    const lower = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.05,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    const higher = calculateQualifyingBet({
      mode: 'qualifying',
      stake: 100,
      backOdds: 2.0,
      layOdds: 2.2,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    expect(lower.ok).toBe(true)
    expect(higher.ok).toBe(true)
    if (!lower.ok || !higher.ok) return
    expect(higher.result.layStake).toBeLessThan(lower.result.layStake)
  })
})
