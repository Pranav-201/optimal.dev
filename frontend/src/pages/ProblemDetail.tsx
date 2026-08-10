import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Timer, Square, Play, Code2, BarChart3, NotebookPen, Check } from 'lucide-react'
import Topbar from '@/components/Topbar'
import DifficultyChip from '@/components/DifficultyChip'
import { useVault } from '@/lib/store'
import { formatClock } from '@/lib/utils'
import type { ApproachKey } from '@/lib/types'

const tabs: { key: ApproachKey; label: string }[] = [
  { key: 'brute', label: 'Brute Force' },
  { key: 'better', label: 'Better' },
  { key: 'optimal', label: 'Optimal' },
]

const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go']

export default function ProblemDetail() {
  const { dayId, problemId } = useParams()
  const navigate = useNavigate()
  const { getDay, getProblem, updateApproach, startProblemTimer, stopProblemTimer } = useVault()
  const day = getDay(dayId!)
  const problem = getProblem(dayId!, problemId!)

  const [tab, setTab] = useState<ApproachKey>('optimal')
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(problem?.timeSpentSec ?? 0)
  const [saved, setSaved] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (problem) {
      setSeconds(problem.timeSpentSec ?? 0)
    }
  }, [problem?.timeSpentSec])

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  if (!day || !problem) return <Navigate to="/" replace />

  const toggleTimer = async () => {
    if (!running) {
      setRunning(true)
      await startProblemTimer(problem.id)
    } else {
      setRunning(false)
      const finalSec = await stopProblemTimer(problem.id)
      if (finalSec > 0) setSeconds(finalSec)
    }
  }

  const approach = problem.approaches[tab]

  const patch = (fields: Partial<typeof approach>) => {
    updateApproach(day.id, problem.id, tab, fields)
    setSaved(false)
  }

  const save = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <>
      <Topbar
        title=""
        right={
          <button
            onClick={() => navigate(`/day/${day.id}`)}
            className="grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors md:hidden"
            aria-label="Back"
          >
            <ArrowLeft size={17} />
          </button>
        }
      />

      <main className="px-5 md:px-8 py-6 max-w-[1200px] mx-auto">
        <button
          onClick={() => navigate(`/day/${day.id}`)}
          className="hidden md:flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          Back to Day {day.dayNumber}
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-on-surface">{problem.title}</h1>
              <DifficultyChip difficulty={problem.difficulty} size="md" />
            </div>
            <p className="text-sm text-on-surface-variant mt-1">{problem.topic}</p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container px-4 py-2.5">
            <Timer size={16} className={running ? 'text-primary-bright animate-pulse' : 'text-on-surface-variant'} />
            <span className="font-mono text-lg text-on-surface tabular-nums">{formatClock(seconds)}</span>
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                running
                  ? 'border border-error/40 text-error hover:bg-error/10'
                  : 'border border-primary/40 text-primary-bright hover:bg-primary/10'
              }`}
            >
              {running ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              {running ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-outline-variant mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2.5 text-sm font-medium font-mono transition-colors ${
                tab === t.key ? 'text-primary-bright' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-bright" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                <Code2 size={14} />
                Solution
              </div>
              <select
                value={approach.language}
                onChange={(e) => patch({ language: e.target.value })}
                className="rounded-md border border-outline-variant bg-surface-container px-2.5 py-1 text-xs font-mono text-on-surface focus:border-primary"
              >
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <textarea
              value={approach.code}
              onChange={(e) => patch({ code: e.target.value })}
              spellCheck={false}
              placeholder="// Write or paste your implementation here"
              className="w-full min-h-[420px] resize-y bg-transparent px-5 py-4 font-mono text-[13px] leading-6 text-on-surface placeholder:text-muted focus:outline-none"
            />
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-outline-variant bg-surface-container p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-tertiary" />
                <h3 className="font-semibold text-on-surface">Complexity</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1.5 block">Time Complexity</label>
                  <input
                    value={approach.timeComplexity}
                    onChange={(e) => patch({ timeComplexity: e.target.value })}
                    placeholder="O(n)"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-mono text-primary-bright placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1.5 block">Space Complexity</label>
                  <input
                    value={approach.spaceComplexity}
                    onChange={(e) => patch({ spaceComplexity: e.target.value })}
                    placeholder="O(1)"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-mono text-primary-bright placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface-container p-5">
              <div className="flex items-center gap-2 mb-4">
                <NotebookPen size={16} className="text-secondary" />
                <h3 className="font-semibold text-on-surface">Implementation Notes</h3>
              </div>
              <textarea
                value={approach.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="Describe your approach, trade-offs, and any edge cases..."
                className="w-full min-h-[140px] resize-y rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface-variant leading-relaxed placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={save}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold uppercase tracking-wide transition ${
                  saved ? 'bg-secondary text-on-primary' : 'bg-primary text-on-primary hover:brightness-110'
                }`}
              >
                {saved ? <Check size={15} /> : <NotebookPen size={15} />}
                {saved ? 'Saved' : 'Save Implementation'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
