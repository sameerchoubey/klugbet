import type { CalculatorMode } from './types'

export interface CalculatorModeConfig {
  mode: CalculatorMode
  title: string
  description: string
  stakeLabel: string
  stakeHelperText: string
  /** Whether the back side risks the user's own money */
  showBackRisk: boolean
  resultLabel: string
  showReturnPct: boolean
  winRowLabel: string
  loseRowLabel: string
  showRefundField: boolean
  refundLabel?: string
  refundHelperText?: string
}

export const MODE_CONFIG: Record<CalculatorMode, CalculatorModeConfig> = {
  qualifying: {
    mode: 'qualifying',
    title: 'Qualifying Bet Calculator',
    description: 'Hedge your qualifying bet to lock in a small, predictable loss and unlock the bookmaker bonus.',
    stakeLabel: 'Back Stake (€)',
    stakeHelperText: 'The real-money amount you bet at the bookmaker to qualify for the bonus.',
    showBackRisk: true,
    resultLabel: 'Guaranteed Result',
    showReturnPct: false,
    winRowLabel: 'If back bet wins',
    loseRowLabel: 'If back bet loses (lay wins)',
    showRefundField: false,
  },
  freeBet: {
    mode: 'freeBet',
    title: 'Free Bet Calculator',
    description: 'Turn a stake-not-returned free bet into guaranteed cash by hedging it at an exchange.',
    stakeLabel: 'Free Bet Amount (€)',
    stakeHelperText: 'The free bet token amount. Stake is never returned — only winnings are paid out.',
    showBackRisk: false,
    resultLabel: 'Extracted Value',
    showReturnPct: true,
    winRowLabel: 'If back bet wins',
    loseRowLabel: 'If back bet loses (lay wins)',
    showRefundField: false,
  },
  jokerBet: {
    mode: 'jokerBet',
    title: 'Joker Bet Calculator',
    description:
      'Hedge a real-money bet, then extract extra value from the free bet you receive if it loses.',
    stakeLabel: 'Back Stake (€)',
    stakeHelperText: 'The real-money amount you bet at the bookmaker.',
    showBackRisk: true,
    resultLabel: 'Guaranteed Minimum Result',
    showReturnPct: true,
    winRowLabel: 'If back bet wins',
    loseRowLabel: 'If back bet loses (refund extracted)',
    showRefundField: true,
    refundLabel: 'Refund Amount if Bet Loses (€)',
    refundHelperText: 'The free bet you receive back from the bookmaker if the back bet loses.',
  },
}
