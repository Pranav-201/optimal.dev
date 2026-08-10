import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Day, Difficulty, Problem, SummaryEntry, VaultState, ApproachKey, Approach } from './types'
import {
  apiFetchDays,
  apiCreateDay,
  apiDeleteDay,
  apiAddProblem,
  apiDeleteProblem,
  apiSaveApproach,
  apiStartTimer,
  apiStopTimer,
  apiFetchSummaries,
  apiGenerateSummary,
} from './api'


interface Ctx {
  state: VaultState
  loading: boolean
  error: string | null
  user: any | null
  token: string | null
  loginUser: (user: any, token: string) => void
  logoutUser: () => void
  getDay: (id: string) => Day | undefined
  getProblem: (dayId: string, problemId: string) => Problem | undefined
  addDay: (dayNumber: number, date: string) => Promise<Day>
  deleteDay: (dayId: string) => Promise<void>
  addProblem: (dayId: string, p: Omit<Problem, 'id' | 'approaches'> & { id?: string }) => Promise<void>
  deleteProblem: (dayId: string, problemId: string) => Promise<void>
  updateApproach: (dayId: string, problemId: string, key: ApproachKey, patch: Partial<Approach>) => Promise<void>
  addSummary: (s: Omit<SummaryEntry, 'id' | 'createdAt'>) => SummaryEntry
  generateAiSummary: (cadence: 'Daily' | 'Weekly' | 'Monthly', fromDay: number, toDay: number) => Promise<SummaryEntry>
  startProblemTimer: (problemId: string) => Promise<void>
  stopProblemTimer: (problemId: string) => Promise<number>
  refresh: () => Promise<void>
  stats: {
    totalSolved: number
    solvedThisWeek: number
    weekBreakdown: Record<Difficulty, number>
    allBreakdown: Record<Difficulty, number>
    streakDays: number[]
    streak: number
  }
}

const VaultContext = createContext<Ctx | null>(null)

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function VaultProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  const [state, setState] = useState<VaultState>({
    days: [],
    streak: 0,
    totalSolvedAllTime: 0,
    summaries: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loginUser = (userData: any, userToken: string) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
    loadBackendData()
  }

  const logoutUser = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setState({ days: [], streak: 0, totalSolvedAllTime: 0, summaries: [] })
  }

  const loadBackendData = async () => {
    const currentToken = localStorage.getItem('token')
    if (!currentToken) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const [days, summaries] = await Promise.all([
        apiFetchDays().catch(() => null),
        apiFetchSummaries().catch(() => null),
      ])

      setState((s) => ({
        ...s,
        days: days ?? s.days,
        summaries: summaries ?? s.summaries,
      }))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Backend offline'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBackendData()
  }, [])

  const getDay = (id: string) => state.days.find((d) => d.id === id)
  const getProblem = (dayId: string, problemId: string) =>
    getDay(dayId)?.problems.find((p) => p.id === problemId)

  const addDay: Ctx['addDay'] = async (dayNumber, date) => {
    try {
      const day = await apiCreateDay(dayNumber, date)
      setState((s) => ({
        ...s,
        days: [day, ...s.days.filter((d) => d.id !== day.id)],
      }))
      return day
    } catch {
      // Local fallback
      const day: Day = { id: uid('day'), dayNumber, date, problems: [] }
      setState((s) => ({ ...s, days: [day, ...s.days] }))
      return day
    }
  }

  const deleteDay: Ctx['deleteDay'] = async (dayId) => {
    try {
      await apiDeleteDay(dayId)
    } catch {
      // ignore offline
    }
    setState((s) => ({ ...s, days: s.days.filter((d) => d.id !== dayId) }))
  }

  const addProblem: Ctx['addProblem'] = async (dayId, p) => {
    const day = getDay(dayId)
    const blank = { language: 'JavaScript', code: '', timeComplexity: '', spaceComplexity: '', notes: '' }
    
    let createdId = p.id ?? uid('prob')
    if (day) {
      try {
        const backendProb = await apiAddProblem(day.dayNumber, {
          title: p.title,
          difficulty: p.difficulty,
          topic: p.topic,
          timeSpentSec: p.timeSpentSec,
        })
        createdId = String(backendProb.id)
      } catch {
        // Fallback to local
      }
    }

    const problem: Problem = {
      id: createdId,
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
      timeSpentSec: p.timeSpentSec,
      approaches: { brute: { ...blank }, better: { ...blank }, optimal: { ...blank } },
    }

    setState((s) => ({
      ...s,
      days: s.days.map((d) => (d.id === dayId ? { ...d, problems: [...d.problems, problem] } : d)),
      totalSolvedAllTime: s.totalSolvedAllTime + 1,
    }))
  }

  const deleteProblem: Ctx['deleteProblem'] = async (dayId, problemId) => {
    try {
      await apiDeleteProblem(problemId)
    } catch {
      // ignore offline
    }
    setState((s) => ({
      ...s,
      days: s.days.map((d) =>
        d.id === dayId ? { ...d, problems: d.problems.filter((p) => p.id !== problemId) } : d
      ),
    }))
  }

  const updateApproach: Ctx['updateApproach'] = async (dayId, problemId, key, patch) => {
    // Local optimistic update
    setState((s) => ({
      ...s,
      days: s.days.map((d) =>
        d.id !== dayId
          ? d
          : {
              ...d,
              problems: d.problems.map((p) =>
                p.id !== problemId
                  ? p
                  : { ...p, approaches: { ...p.approaches, [key]: { ...p.approaches[key], ...patch } } }
              ),
            }
      ),
    }))

    // Save to backend
    try {
      const problem = getProblem(dayId, problemId)
      if (problem) {
        const full = { ...problem.approaches[key], ...patch }
        await apiSaveApproach(problemId, key, full)
      }
    } catch {
      // ignore save error
    }
  }

  const addSummary: Ctx['addSummary'] = (s) => {
    const entry: SummaryEntry = { ...s, id: uid('sum'), createdAt: new Date().toISOString().slice(0, 10) }
    setState((st) => ({ ...st, summaries: [entry, ...st.summaries] }))
    return entry
  }

  const generateAiSummary: Ctx['generateAiSummary'] = async (cadence, fromDay, toDay) => {
    try {
      const summary = await apiGenerateSummary(cadence, fromDay, toDay)
      setState((st) => ({
        ...st,
        summaries: [summary, ...st.summaries.filter((s) => s.id !== summary.id)],
      }))
      return summary
    } catch (err) {
      // Fallback
      throw err
    }
  }

  const startProblemTimer: Ctx['startProblemTimer'] = async (problemId) => {
    try {
      await apiStartTimer(problemId)
    } catch {
      // ignore
    }
  }

  const stopProblemTimer: Ctx['stopProblemTimer'] = async (problemId) => {
    try {
      const updated = await apiStopTimer(problemId)
      const seconds = updated.timerSeconds || 0
      setState((s) => ({
        ...s,
        days: s.days.map((d) => ({
          ...d,
          problems: d.problems.map((p) => (p.id === problemId ? { ...p, timeSpentSec: seconds } : p)),
        })),
      }))
      return seconds
    } catch {
      return 0
    }
  }

  const stats = useMemo(() => {
    const allBreakdown: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 }
    const weekBreakdown: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 }
    let totalSolved = 0
    let solvedThisWeek = 0

    // Calculate dynamic practice streak based on consecutive active days
    const activeDays = [...state.days]
      .filter((d) => d.problems.length > 0)
      .sort((a, b) => a.dayNumber - b.dayNumber)

    let streak = 0
    if (activeDays.length > 0) {
      streak = 1
      for (let i = activeDays.length - 1; i > 0; i--) {
        const current = activeDays[i]
        const prev = activeDays[i - 1]

        const currDate = new Date(current.date.slice(0, 10))
        const prevDate = new Date(prev.date.slice(0, 10))
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24))
        const diffNumber = current.dayNumber - prev.dayNumber

        if (diffDays === 1 || diffNumber === 1 || diffDays === 0) {
          if (diffDays !== 0 || diffNumber !== 0) {
            streak += 1
          }
        } else {
          break
        }
      }
    }

    const sortedDesc = [...state.days].sort((a, b) => b.dayNumber - a.dayNumber)
    const recentDayIds = new Set(sortedDesc.slice(0, 7).map((d) => d.id))

    for (const day of state.days) {
      for (const p of day.problems) {
        totalSolved += 1
        allBreakdown[p.difficulty] += 1
        if (recentDayIds.has(day.id)) {
          solvedThisWeek += 1
          weekBreakdown[p.difficulty] += 1
        }
      }
    }

    const streakDays = sortedDesc.slice(0, 7).map((d) => d.problems.length)

    return { totalSolved, solvedThisWeek, weekBreakdown, allBreakdown, streakDays, streak }
  }, [state.days])

  const value: Ctx = {
    state,
    loading,
    error,
    user,
    token,
    loginUser,
    logoutUser,
    getDay,
    getProblem,
    addDay,
    deleteDay,
    addProblem,
    deleteProblem,
    updateApproach,
    addSummary,
    generateAiSummary,
    startProblemTimer,
    stopProblemTimer,
    refresh: loadBackendData,
    stats,
  }

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function useVault() {
  const ctx = useContext(VaultContext)
  if (!ctx) throw new Error('useVault must be used within VaultProvider')
  return ctx
}
