export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type ApproachKey = 'brute' | 'better' | 'optimal'

export interface Approach {
  id?: number | string
  language: string
  code: string
  timeComplexity: string
  spaceComplexity: string
  notes: string
}

export interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  topic: string
  timeSpentSec: number
  timerStartedAt?: string
  approaches: Record<ApproachKey, Approach>
}

export interface Day {
  id: string
  dayNumber: number
  date: string // ISO date
  problems: Problem[]
}

export interface SummaryEntry {
  id: string
  label: string
  range: string
  cadence: 'Daily' | 'Weekly' | 'Monthly'
  body: string
  createdAt: string
}

export interface VaultState {
  days: Day[]
  streak: number
  totalSolvedAllTime: number
  summaries: SummaryEntry[]
}
