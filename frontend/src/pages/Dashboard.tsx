import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Sigma, Flame, CalendarDays, ArrowRight, Trash2 } from 'lucide-react'
import Topbar from '@/components/Topbar'
import Modal from '@/components/Modal'
import DifficultyChip from '@/components/DifficultyChip'
import { useVault } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import type { Difficulty } from '@/lib/types'

function RingProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const r = 15
  const c = 2 * Math.PI * r
  const pct = max > 0 ? Math.min(value / max, 1) : 0
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="var(--color-surface-container-high)" strokeWidth="3.5" />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  )
}

export default function Dashboard() {
  const { state, stats, addDay, deleteDay } = useVault()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dayNumber, setDayNumber] = useState(state.days.length ? Math.max(...state.days.map((d) => d.dayNumber)) + 1 : 1)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const allDaysSorted = useMemo(() => [...state.days].sort((a, b) => b.dayNumber - a.dayNumber), [state.days])

  const recent = useMemo(() => {
    const sorted = allDaysSorted
    if (!query.trim()) return sorted.slice(0, 8)
    const q = query.toLowerCase()
    return sorted.filter((day) =>
      day.problems.some((p) => p.title.toLowerCase().includes(q))
    )
  }, [allDaysSorted, query])
  const weekPct = Math.round(((stats.weekBreakdown.Easy + stats.weekBreakdown.Medium * 1.3 + stats.weekBreakdown.Hard * 1.6) / 20) * 100)

  const ringColor: Record<Difficulty, string> = {
    Easy: 'var(--color-secondary)',
    Medium: 'var(--color-tertiary)',
    Hard: 'var(--color-error)',
  }

  const submit = async () => {
    const day = await addDay(Number(dayNumber), date)
    setOpen(false)
    navigate(`/day/${day.id}`)
  }

  return (
    <>
      <Topbar searchPlaceholder="Search problems..." onSearch={setQuery} />

      <main className="px-5 md:px-8 py-6 max-w-[1200px] mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-on-surface">Progress Overview</h2>
            <p className="text-sm text-on-surface-variant mt-1">Track your algorithmic consistency.</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-on-primary hover:brightness-110 active:scale-[0.98] transition"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Day
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-outline-variant bg-surface-container p-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-semibold tracking-wider text-muted uppercase">Total Problems Solved</p>
              <Sigma size={18} className="text-outline" />
            </div>
            <p className="mt-3 text-3xl font-bold text-primary-bright font-mono-tight">
              {stats.totalSolved}
              <span className="ml-2 text-xs font-sans font-medium text-on-surface-variant">all time</span>
            </p>
            <div className="mt-4 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, stats.totalSolved / 2)}%` }} />
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container p-5 animate-fade-up" style={{ animationDelay: '40ms' }}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-semibold tracking-wider text-muted uppercase">Current Streak</p>
              <Flame size={18} className="text-tertiary" />
            </div>
            <p className="mt-3 text-3xl font-bold text-tertiary font-mono-tight">{stats.streak} Days</p>
            <div className="mt-4 flex gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${i < Math.min(7, stats.streak) ? 'bg-tertiary' : 'bg-surface-container-high'}`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container p-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-semibold tracking-wider text-muted uppercase">Solved This Week</p>
              <CalendarDays size={18} className="text-outline" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-on-surface font-mono-tight">{stats.solvedThisWeek}</p>
              <span className="text-xs font-mono text-secondary">↗ {weekPct}% vs last week</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
                <div key={d} className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="w-10 text-muted">{d.slice(0, 3)}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (stats.weekBreakdown[d] / Math.max(1, stats.solvedThisWeek)) * 100)}%`,
                        background: ringColor[d],
                      }}
                    />
                  </div>
                  <span className="w-4 text-right text-on-surface-variant">{stats.weekBreakdown[d]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-on-surface">Recent Logs</h3>
          <button className="flex items-center gap-1 text-xs font-medium text-primary-bright hover:underline">
            View All <ArrowRight size={13} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
            <p className="text-sm text-on-surface-variant">
              {query.trim()
                ? `No problems matching "${query}" found.`
                : 'No days logged yet. Add your first day to start tracking.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.map((day, i) => {
              const hard = day.problems.filter((p) => p.difficulty === 'Hard').length
              const med = day.problems.filter((p) => p.difficulty === 'Medium').length
              const easy = day.problems.filter((p) => p.difficulty === 'Easy').length
              const dominant: Difficulty = hard ? 'Hard' : med ? 'Medium' : 'Easy'
              return (
                <div
                  key={day.id}
                  onClick={() => navigate(`/day/${day.id}`)}
                  className="group relative cursor-pointer rounded-xl border border-outline-variant bg-surface-container p-5 hover:border-primary/40 hover:bg-surface-container-high transition-colors animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDay(day.id)
                    }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-muted hover:text-error transition-opacity"
                    aria-label="Delete day"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-start justify-between pr-6">
                    <div>
                      <p className="font-semibold text-on-surface">Day {day.dayNumber}</p>
                      <p className="text-xs font-mono text-muted mt-0.5">{formatDate(day.date)}</p>
                    </div>
                    <RingProgress value={day.problems.length} max={4} color={ringColor[dominant]} />
                  </div>
                  <p className="text-sm text-on-surface-variant mt-4">
                    {day.problems.length} Problem{day.problems.length === 1 ? '' : 's'} Solved
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {easy > 0 && <DifficultyChip difficulty="Easy" />}
                    {med > 0 && <DifficultyChip difficulty="Medium" />}
                    {hard > 0 && <DifficultyChip difficulty="Hard" />}
                    {easy > 0 && (
                      <span className="text-[11px] font-mono text-muted self-center">
                        {easy} Easy
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title="Add a New Day">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Day Number</label>
            <input
              type="number"
              value={dayNumber}
              onChange={(e) => setDayNumber(Number(e.target.value))}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={submit}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold uppercase tracking-wide text-on-primary hover:brightness-110 transition"
          >
            Create Day
          </button>
        </div>
      </Modal>
    </>
  )
}
