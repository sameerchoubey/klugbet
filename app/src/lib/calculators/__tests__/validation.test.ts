import { describe, it, expect } from 'vitest'
import { validateInputs } from '../validation'
import type { BetCalculatorInputs } from '../types'

const baseInputs: BetCalculatorInputs = {
  mode: 'qualifying',
  stake: 100,
  backOdds: 2.0,
  layOdds: 2.1,
  backCommissionPct: 0,
  layCommissionPct: 2,
  refundAmount: 0,
}

describe('validateInputs', () => {
  it('returns no errors for valid inputs', () => {
    expect(validateInputs(baseInputs)).toEqual([])
  })

  it('flags stake <= 0', () => {
    const errors = validateInputs({ ...baseInputs, stake: 0 })
    expect(errors.some((e) => e.field === 'stake')).toBe(true)
  })

  it('flags backOdds <= 1', () => {
    const errors = validateInputs({ ...baseInputs, backOdds: 1 })
    expect(errors.some((e) => e.field === 'backOdds')).toBe(true)
  })

  it('flags layOdds <= 1', () => {
    const errors = validateInputs({ ...baseInputs, layOdds: 1 })
    expect(errors.some((e) => e.field === 'layOdds')).toBe(true)
  })

  it('flags backCommissionPct outside [0, 100]', () => {
    const errors = validateInputs({ ...baseInputs, backCommissionPct: -1 })
    expect(errors.some((e) => e.field === 'backCommissionPct')).toBe(true)
  })

  it('flags layCommissionPct below 0', () => {
    const errors = validateInputs({ ...baseInputs, layCommissionPct: -1 })
    expect(errors.some((e) => e.field === 'layCommissionPct')).toBe(true)
  })

  it('flags layCommissionPct above 100', () => {
    const errors = validateInputs({ ...baseInputs, layCommissionPct: 101 })
    expect(errors.some((e) => e.field === 'layCommissionPct')).toBe(true)
  })

  it('flags a negative refundAmount only for jokerBet mode', () => {
    const jokerErrors = validateInputs({ ...baseInputs, mode: 'jokerBet', refundAmount: -5 })
    expect(jokerErrors.some((e) => e.field === 'refundAmount')).toBe(true)

    const qualifyingErrors = validateInputs({ ...baseInputs, mode: 'qualifying', refundAmount: -5 })
    expect(qualifyingErrors.some((e) => e.field === 'refundAmount')).toBe(false)
  })

  it('flags a near-zero divisor as a general error', () => {
    const errors = validateInputs({ ...baseInputs, layOdds: 1.00005, layCommissionPct: 100 })
    expect(errors.some((e) => e.field === 'general')).toBe(true)
  })

  it('accepts zero commission on both sides', () => {
    expect(validateInputs({ ...baseInputs, backCommissionPct: 0, layCommissionPct: 0 })).toEqual([])
  })
})
