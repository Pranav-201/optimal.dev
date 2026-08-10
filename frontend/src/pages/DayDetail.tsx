import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Plus, Timer, Trash2, ChevronRight } from 'lucide-react'
import Topbar from '@/components/Topbar'
import Modal from '@/components/Modal'
import DifficultyChip from '@/components/DifficultyChip'
import { useVault } from '@/lib/store'
import { formatClock, formatDate } from '@/lib/utils'
import type { Difficulty } from '@/lib/types'

const topics = ['Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search', 'Linked List', 'Trees', 'Heap / Bucket Sort', 'Backtracking', 'Graphs', 'Dynamic Programming']

export default function DayDetail() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const { getDay, addProblem, deleteProblem } = useVault()
  const day = getDay(dayId!)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')
  const [topic, setTopic] = useState(topics[0])
  const [minutes, setMinutes] = useState(20)

  if (!day) return <Navigate to="/" replace />

  const submit = async () => {
    if (!title.trim()) return
    await addProblem(day.id, { title: title.trim(), difficulty, topic, timeSpentSec: minutes * 60 })
    setTitle('')
    setMinutes(20)
    setOpen(false)
  }

  return (
    <>
      <Topbar
        title={`Day ${day.dayNumber} — ${formatDate(day.date)}`}
        subtitle={`${day.problems.length} Problem${day.problems.length === 1 ? '' : 's'} Completed`}
        right={
          <button
            onClick={() => navigate('/')}
            className="grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors md:hidden"
            aria-label="Back"
          >
            <ArrowLeft size={17} />
          </button>
        }
      />

      <main className="px-5 md:px-8 py-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="hidden md:flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <button
            onClick={() => setOpen(true)}
            className="ml-auto flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-on-primary hover:brightness-110 active:scale-[0.98] transition"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Problem
          </button>
        </div>

        {day.problems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
            <p className="text-sm text-on-surface-variant">No problems logged for this day yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {day.problems.map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate(`/day/${day.id}/problem/${p.id}`)}
                className="group cursor-pointer rounded-xl border border-outline-variant bg-gradient-to-b from-surface-container to-surface-container-lowest p-5 hover:border-primary/40 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-on-surface pr-2">{p.title}</h3>
                  <ChevronRight size={16} className="text-muted group-hover:text-primary-bright group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <DifficultyChip difficulty={p.difficulty} />
                  <span className="rounded-md bg-surface-container-high px-2 py-0.5 text-[11px] font-mono text-on-surface-variant ring-1 ring-outline-variant">
                    {p.topic}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">Time</p>
                    <p className="flex items-center gap-1.5 text-sm font-mono text-on-surface-variant">
                      <Timer size={13} />
                      {formatClock(p.timeSpentSec)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProblem(day.id, p.id)
                    }}
                    className="grid h-8 w-8 place-items-center rounded-md text-muted hover:text-error hover:bg-error/10 transition-colors"
                    aria-label="Delete problem"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Problem">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Problem Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Longest Substring Without Repeating Characters"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Time (min)</label>
              <input
                type="number"
                min={1}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-on-surface-variant mb-1.5 block">Topic / Pattern</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <button
            onClick={submit}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold uppercase tracking-wide text-on-primary hover:brightness-110 transition"
          >
            Add Problem
          </button>
        </div>
      </Modal>
    </>
  )
}
