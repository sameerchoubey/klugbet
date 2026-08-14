export type CalculatorMode = 'qualifying' | 'freeBet' | 'jokerBet'

export interface BetCalculatorInputs {
  mode: CalculatorMode
  /** Back stake (qualifying/jokerBet) or Free Bet amount (freeBet) */
  stake: number
  /** Ob, decimal odds */
  backOdds: number
  /** Ol, decimal odds */
  layOdds: number
  /** Tax/commission the bookmaker takes on back-side winnings, as a whole-number percent (e.g. German Wettsteuer). Default 0. */
  backCommissionPct: number
  /** Exchange commission on lay-side winnings, as a whole-number percent. Default 0. */
  layCommissionPct: number
  /** jokerBet only: the amount refunded as a free bet if the back bet loses */
  refundAmount: number
}

export interface BetCalculatorResult {
  layStake: number
  liability: number
  backWinProfit: number
  layWinProfit: number
  /** qualifying/freeBet: the equalized guaranteed result. jokerBet: the true guaranteed minimum across both branches. */
  guaranteedProfit: number
  returnPct: number | null
  /** jokerBet only: the hedge placed on the refunded free bet, once granted */
  refundLayStake?: number
  refundLiability?: number
  /** jokerBet only: the guaranteed value extracted from the refund free bet */
  refundExtractedValue?: number
}

export interface ValidationError {
  field:
    | 'stake'
    | 'backOdds'
    | 'layOdds'
    | 'backCommissionPct'
    | 'layCommissionPct'
    | 'refundAmount'
    | 'general'
  message: string
}

export type CalculatorOutcome =
  | { ok: true; result: BetCalculatorResult }
  | { ok: false; errors: ValidationError[] }
