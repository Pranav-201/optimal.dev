import { useMemo, useState } from 'react'
import { Sparkles, ChevronDown, Download, TrendingUp, RotateCcw, History } from 'lucide-react'
import Topbar from '@/components/Topbar'
import { useVault } from '@/lib/store'
import { generateSynthesis } from '@/lib/utils'
import type { SummaryEntry } from '@/lib/types'

const cadences: SummaryEntry['cadence'][] = ['Daily', 'Weekly', 'Monthly']

function AccordionRow({ entry }: { entry: SummaryEntry }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-surface-container-high transition-colors"
      >
        <span className="flex items-center gap-3">
          <ChevronDown size={16} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
          <span className="font-semibold text-on-surface">{entry.label}</span>
        </span>
        <span className="rounded-md bg-surface-container-high px-2 py-1 text-[11px] font-mono text-on-surface-variant ring-1 ring-outline-variant">
          {entry.cadence}
        </span>
      </button>
      {open && (
        <div className="border-t border-outline-variant px-5 py-4 animate-fade-up">
          <p className="text-sm text-on-surface-variant leading-relaxed">{entry.body}</p>
        </div>
      )}
    </div>
  )
}

export default function Revision() {
  const { state, addSummary, generateAiSummary } = useVault()
  const [cadence, setCadence] = useState<SummaryEntry['cadence']>('Monthly')
  const days = state.days.map((d) => d.dayNumber)
  const [fromDay, setFromDay] = useState(days.length ? Math.min(...days) : 1)
  const [toDay, setToDay] = useState(days.length ? Math.max(...days) : 1)
  const [generating, setGenerating] = useState(false)
  const [query, setQuery] = useState('')
  const [synthesis, setSynthesis] = useState(() => generateSynthesis(state.days, fromDay, toDay))

  const overall = useMemo(() => {
    const all = state.days.flatMap((d) => d.problems)
    return {
      total: all.length,
      goal: 50,
      easy: all.filter((p) => p.difficulty === 'Easy').length,
      med: all.filter((p) => p.difficulty === 'Medium').length,
      hard: all.filter((p) => p.difficulty === 'Hard').length,
    }
  }, [state.days])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const summaryEntry = await generateAiSummary(cadence, fromDay, toDay)
      setSynthesis({
        body: summaryEntry.body,
        mastered: ['Arrays & Hashing', 'Two Pointers'],
        needsReview: ['Dynamic Programming', 'Graphs'],
        easy: overall.easy,
        med: overall.med,
        hard: overall.hard,
        total: overall.total,
      })
    } catch {
      const result = generateSynthesis(state.days, fromDay, toDay)
      setSynthesis(result)
      addSummary({
        label: `Day ${fromDay}–${toDay} Summary`,
        range: `Days ${fromDay}–${toDay}`,
        cadence,
        body: result.body,
      })
    } finally {
      setGenerating(false)
    }
  }

  const exportReport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      totals: overall,
      days: state.days,
      summaries: state.summaries,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'optimal-dev-report.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar searchPlaceholder="Search patterns..." onSearch={setQuery} />

      <main className="flex-1 overflow-y-auto px-5 md:px-8 py-6">        
        <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-[28px] font-bold tracking-tight text-on-surface">Spaced Repetition</h2>
            <p className="text-sm text-on-surface-variant mt-1">Review your problem-solving patterns and generate AI insights.</p>
          </div>
          <div className="flex rounded-lg border border-outline-variant bg-surface-container-lowest p-1">
            {cadences.map((c) => (
              <button
                key={c}
                onClick={() => setCadence(c)}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  cadence === c ? 'bg-primary/15 text-primary-bright ring-1 ring-primary/30' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">From Day</label>
              <input
                type="number"
                value={fromDay}
                onChange={(e) => setFromDay(Number(e.target.value))}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm font-mono text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">To Day</label>
              <input
                type="number"
                value={toDay}
                onChange={(e) => setToDay(Number(e.target.value))}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm font-mono text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60"
            >
              <Sparkles size={16} className={generating ? 'animate-spin' : ''} />
              {generating ? 'Generating…' : 'Generate AI Summary'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-8">
          <div className="rounded-xl border border-outline-variant bg-gradient-to-br from-surface-container to-surface-container-lowest p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={17} className="text-primary-bright" />
              <h3 className="text-lg font-bold text-on-surface">{cadence} Synthesis</h3>
              <span className="text-xs font-mono text-muted">Days {fromDay} – {toDay}</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{synthesis.body}</p>

            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <div className="rounded-lg border-l-2 border-secondary bg-surface-container-lowest p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-secondary mb-2">
                  <TrendingUp size={14} /> Mastered Patterns
                </p>
                <ul className="space-y-1 text-xs font-mono text-on-surface-variant">
                  {synthesis.mastered.length ? synthesis.mastered.map((m) => <li key={m}>• {m}</li>) : <li>Not enough data yet</li>}
                </ul>
              </div>
              <div className="rounded-lg border-l-2 border-tertiary bg-surface-container-lowest p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-tertiary mb-2">
                  <RotateCcw size={14} /> Needs Review
                </p>
                <ul className="space-y-1 text-xs font-mono text-on-surface-variant">
                  {synthesis.needsReview.length ? synthesis.needsReview.map((m) => <li key={m}>• {m}</li>) : <li>Not enough data yet</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container p-5 h-fit sticky top-0">
            <h3 className="font-semibold text-on-surface mb-4">Activity Overview</h3>
            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-1.5">
              <span>Problems Solved</span>
              <span>{overall.total}/{overall.goal}</span>
            </div>
            <div className="h-2 rounded-full bg-surface-container-high overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${Math.min(100, (overall.total / overall.goal) * 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="rounded-md bg-secondary/15 px-2.5 py-1 text-[11px] font-mono text-secondary ring-1 ring-secondary/30">Easy: {overall.easy}</span>
              <span className="rounded-md bg-tertiary/15 px-2.5 py-1 text-[11px] font-mono text-tertiary ring-1 ring-tertiary/30">Med: {overall.med}</span>
              <span className="rounded-md bg-error/15 px-2.5 py-1 text-[11px] font-mono text-error ring-1 ring-error/30">Hard: {overall.hard}</span>
            </div>
            <button
              onClick={exportReport}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 py-2.5 text-sm font-semibold text-primary-bright hover:bg-primary/10 transition"
            >
              <Download size={15} />
              Export Report
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <History size={17} className="text-on-surface-variant" />
          <h3 className="text-lg font-bold text-on-surface">Past Summaries</h3>
        </div>
        <div className="space-y-3">
          {state.summaries
            .filter((s) => {
              if (!query.trim()) return true
              const q = query.toLowerCase()
              return s.label.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
            })
            .map((s) => (
              <AccordionRow key={s.id} entry={s} />
            ))}
          {state.summaries.length > 0 &&
            state.summaries.filter((s) => {
              if (!query.trim()) return true
              const q = query.toLowerCase()
              return s.label.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
            }).length === 0 && (
            <p className="text-sm text-on-surface-variant text-center py-6">No summaries matching "{query}".</p>
          )}
        </div>
      </div>
    </main>
  </div>
  )
}
