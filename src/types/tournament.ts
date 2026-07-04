import type { Stat } from './stat'

export interface TournamentEntry {
  size?: 4 | 5 | 6
  isGoalsFilled: boolean
  isDataFilled: boolean
  stats: {
    a: Stat[]
    b: Stat[]
  }
}
