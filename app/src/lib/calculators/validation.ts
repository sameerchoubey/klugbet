import type { BetCalculatorInputs, ValidationError } from './types'

export function validateInputs(inputs: BetCalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = []

  if (!(inputs.stake > 0)) {
    errors.push({ field: 'stake', message: 'Stake must be greater than 0' })
  }

  if (!(inputs.backOdds > 1)) {
    errors.push({ field: 'backOdds', message: 'Back odds must be greater than 1.00' })
  }

  if (!(inputs.layOdds > 1)) {
    errors.push({ field: 'layOdds', message: 'Lay odds must be greater than 1.00' })
  }

  if (!(inputs.backCommissionPct >= 0 && inputs.backCommissionPct <= 100)) {
    errors.push({ field: 'backCommissionPct', message: 'Back commission must be between 0% and 100%' })
  }

  if (!(inputs.layCommissionPct >= 0 && inputs.layCommissionPct <= 100)) {
    errors.push({ field: 'layCommissionPct', message: 'Exchange commission must be between 0% and 100%' })
  }

  if (inputs.mode === 'jokerBet' && !(inputs.refundAmount >= 0)) {
    errors.push({ field: 'refundAmount', message: 'Refund amount cannot be negative' })
  }

  if (errors.length === 0) {
    const denom = inputs.layOdds - inputs.layCommissionPct / 100
    if (denom <= 0.0001) {
      errors.push({
        field: 'general',
        message: 'Lay odds minus exchange commission must be positive — increase lay odds or reduce commission',
      })
    }
  }

  return errors
}
