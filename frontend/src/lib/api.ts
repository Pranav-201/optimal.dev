import type { Day, Difficulty, Problem, SummaryEntry, ApproachKey, Approach } from './types'

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api'

const blankApproach = (): Approach => ({
  language: 'JavaScript',
  code: '',
  timeComplexity: '',
  spaceComplexity: '',
  notes: '',
})

export interface BackendApproach {
  id: number
  problemId: number
  type: ApproachKey
  code: string
  language: string
  timeComplexity: string
  spaceComplexity: string
  notes: string
}

export interface BackendProblem {
  id: number
  dayId: number
  title: string
  url?: string
  difficulty: Difficulty
  pattern?: string
  timerSeconds?: number
  timerStartedAt?: string
  timerStoppedAt?: string
  Approaches?: BackendApproach[]
}

export interface BackendDay {
  id: number
  dayNumber: number
  date: string
  notes?: string
  Problems?: BackendProblem[]
}

export interface BackendSummary {
  id: number
  type: 'daily' | 'weekly' | 'monthly'
  refKey: string
  content: string
  createdAt: string
}

export function backendToFrontendDay(bDay: BackendDay): Day {
  const problems: Problem[] = (bDay.Problems || []).map((p) => {
    const approachesRecord: Record<ApproachKey, Approach> = {
      brute: blankApproach(),
      better: blankApproach(),
      optimal: blankApproach(),
    }

    if (p.Approaches) {
      for (const a of p.Approaches) {
        if (a.type && (a.type === 'brute' || a.type === 'better' || a.type === 'optimal')) {
          approachesRecord[a.type] = {
            id: a.id,
            language: a.language || 'JavaScript',
            code: a.code || '',
            timeComplexity: a.timeComplexity || '',
            spaceComplexity: a.spaceComplexity || '',
            notes: a.notes || '',
          }
        }
      }
    }

    return {
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty || 'Medium',
      topic: p.pattern || 'General',
      timeSpentSec: p.timerSeconds || 0,
      timerStartedAt: p.timerStartedAt,
      approaches: approachesRecord,
    }
  })

  return {
    id: String(bDay.id),
    dayNumber: bDay.dayNumber,
    date: bDay.date ? bDay.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    problems,
  }
}

export function backendToFrontendSummary(s: BackendSummary): SummaryEntry {
  const cadenceMap: Record<string, 'Daily' | 'Weekly' | 'Monthly'> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  }
  return {
    id: String(s.id),
    label: `Day ${s.refKey} Summary`,
    range: `Days ${s.refKey}`,
    cadence: cadenceMap[s.type] || 'Monthly',
    body: s.content,
    createdAt: s.createdAt ? s.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
  }
}

// Helper to inject token
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const config = { ...options, headers }
  return fetch(url, config)
}

// API functions
export async function apiLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.message || 'Login failed')
  }
  return res.json()
}

export async function apiRegister(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.message || 'Register failed')
  }
  return res.json()
}

export async function apiFetchDays(): Promise<Day[]> {
  const res = await fetchWithAuth(`${API_BASE}/days`)
  if (!res.ok) throw new Error('Failed to fetch days')
  const json = await res.json()
  return (json.data || []).map(backendToFrontendDay)
}

export async function apiCreateDay(dayNumber: number, date: string, notes?: string): Promise<Day> {
  const res = await fetchWithAuth(`${API_BASE}/days`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dayNumber, date, notes }),
  })
  if (!res.ok) throw new Error('Failed to create day')
  const json = await res.json()
  return backendToFrontendDay(json.data)
}

export async function apiDeleteDay(dayId: string): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/days/${dayId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete day')
}

export async function apiAddProblem(
  dayNumber: number,
  problem: { title: string; difficulty: Difficulty; topic: string; timeSpentSec?: number }
): Promise<BackendProblem> {
  const res = await fetchWithAuth(`${API_BASE}/problems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dayNumber,
      title: problem.title,
      difficulty: problem.difficulty,
      pattern: problem.topic,
      timerSeconds: problem.timeSpentSec,
    }),
  })
  if (!res.ok) throw new Error('Failed to add problem')
  const json = await res.json()
  return json.data
}

export async function apiDeleteProblem(problemId: string): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/problems/${problemId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete problem')
}

export async function apiSaveApproach(
  problemId: string,
  type: ApproachKey,
  approach: Partial<Approach>
): Promise<BackendApproach> {
  const res = await fetchWithAuth(`${API_BASE}/approaches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      problemId: Number(problemId),
      type,
      code: approach.code || '',
      language: approach.language || 'JavaScript',
      timeComplexity: approach.timeComplexity || '',
      spaceComplexity: approach.spaceComplexity || '',
      notes: approach.notes || '',
    }),
  })
  if (!res.ok) throw new Error('Failed to save approach')
  const json = await res.json()
  return json.data
}

export async function apiStartTimer(problemId: string): Promise<BackendProblem> {
  const res = await fetchWithAuth(`${API_BASE}/problems/${problemId}/timer/start`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start timer')
  const json = await res.json()
  return json.data
}

export async function apiStopTimer(problemId: string): Promise<BackendProblem> {
  const res = await fetchWithAuth(`${API_BASE}/problems/${problemId}/timer/stop`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to stop timer')
  const json = await res.json()
  return json.data
}

export async function apiFetchSummaries(type?: string): Promise<SummaryEntry[]> {
  const url = type ? `${API_BASE}/summaries?type=${type}` : `${API_BASE}/summaries`
  const res = await fetchWithAuth(url)
  if (!res.ok) throw new Error('Failed to fetch summaries')
  const json = await res.json()
  return (json.data || []).map(backendToFrontendSummary)
}

export async function apiGenerateSummary(
  cadence: 'Daily' | 'Weekly' | 'Monthly',
  fromDay: number,
  toDay: number
): Promise<SummaryEntry> {
  let endpoint = `${API_BASE}/summaries/daily`
  let body: Record<string, unknown> = { dayNumber: fromDay }

  if (cadence === 'Weekly') {
    endpoint = `${API_BASE}/summaries/weekly`
    body = { fromDay, toDay }
  } else if (cadence === 'Monthly') {
    endpoint = `${API_BASE}/summaries/monthly`
    body = { fromDay, toDay }
  }

  const res = await fetchWithAuth(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to generate AI summary')
  const json = await res.json()
  return backendToFrontendSummary(json.data)
}
