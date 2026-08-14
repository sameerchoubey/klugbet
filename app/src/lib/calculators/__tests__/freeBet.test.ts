import { describe, it, expect } from 'vitest'
import { calculateFreeBet } from '../freeBet'

describe('calculateFreeBet', () => {
  it('matches the user-provided example: 10€ free bet @ 4.7 pays 37€ in winnings on a win', () => {
    const outcome = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 4.7,
      layOdds: 4.8,
      backCommissionPct: 0,
      layCommissionPct: 0,
      refundAmount: 0,
    })

    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    // netWinnings before the lay hedge is stake * (odds - 1) = 10 * 3.7 = 37
    expect(10 * (4.7 - 1)).toBeCloseTo(37, 6)
  })

  it('matches the worked example (F=10, Ob=5.0, Ol=5.1, layCommission=2%) — extracted value ~77%', () => {
    const outcome = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 5.0,
      layOdds: 5.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })

    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return

    expect(outcome.result.layStake).toBeCloseTo(7.87, 1)
    expect(outcome.result.backWinProfit).toBeCloseTo(7.72, 1)
    expect(outcome.result.layWinProfit).toBeCloseTo(7.72, 1)
    expect(outcome.result.returnPct).toBeGreaterThan(65)
    expect(outcome.result.returnPct).toBeLessThan(80)
  })

  it('accounts for back-side commission/tax reducing extracted value', () => {
    const withoutTax = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 5.0,
      layOdds: 5.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    const withTax = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 5.0,
      layOdds: 5.1,
      backCommissionPct: 5,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    expect(withoutTax.ok).toBe(true)
    expect(withTax.ok).toBe(true)
    if (!withoutTax.ok || !withTax.ok) return
    expect(withTax.result.guaranteedProfit).toBeLessThan(withoutTax.result.guaranteedProfit)
  })

  it('produces (approximately) equal outcomes regardless of which side wins', () => {
    const outcome = calculateFreeBet({
      mode: 'freeBet',
      stake: 20,
      backOdds: 3.0,
      layOdds: 3.1,
      backCommissionPct: 0,
      layCommissionPct: 3,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    expect(outcome.result.backWinProfit).toBeCloseTo(outcome.result.layWinProfit, 6)
  })

  it('rejects back odds <= 1', () => {
    const outcome = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 1,
      layOdds: 5.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(false)
  })

  it('rejects zero or negative stake', () => {
    const outcome = calculateFreeBet({
      mode: 'freeBet',
      stake: -5,
      backOdds: 5.0,
      layOdds: 5.1,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(false)
  })

  it('handles zero commission on both sides', () => {
    const outcome = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 5.0,
      layOdds: 5.1,
      backCommissionPct: 0,
      layCommissionPct: 0,
      refundAmount: 0,
    })
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    expect(outcome.result.layStake).toBeCloseTo((10 * (5.0 - 1)) / 5.1, 6)
  })

  it('requires less lay stake as lay odds increase (monotonicity)', () => {
    const lower = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 5.0,
      layOdds: 5.0,
      backCommissionPct: 0,
      layCommissionPct: 2,
      refundAmount: 0,
    })
    const higher = calculateFreeBet({
      mode: 'freeBet',
      stake: 10,
      backOdds: 5.0,
      layOdds: 5.5,
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
