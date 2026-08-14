import type { BetCalculatorInputs, CalculatorOutcome } from './types'
import { calculateQualifyingBet } from './qualifyingBet'
import { calculateFreeBet } from './freeBet'
import { calculateJokerBet } from './jokerBet'

export function calculate(inputs: BetCalculatorInputs): CalculatorOutcome {
  switch (inputs.mode) {
    case 'qualifying':
      return calculateQualifyingBet(inputs)
    case 'freeBet':
      return calculateFreeBet(inputs)
    case 'jokerBet':
      return calculateJokerBet(inputs)
  }
}

export * from './types'
export * from './modeConfig'
export { calculateQualifyingBet } from './qualifyingBet'
export { calculateFreeBet } from './freeBet'
export { calculateJokerBet } from './jokerBet'
