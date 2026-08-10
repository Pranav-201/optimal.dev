import type { Day, Difficulty } from './types'

export function formatClock(totalSec: number) {
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const difficultyStyles: Record<Difficulty, { text: string; bg: string; ring: string }> = {
  Easy: { text: 'text-secondary', bg: 'bg-secondary/15', ring: 'ring-secondary/30' },
  Medium: { text: 'text-tertiary', bg: 'bg-tertiary/15', ring: 'ring-tertiary/30' },
  Hard: { text: 'text-error', bg: 'bg-error/15', ring: 'ring-error/30' },
}

// Deterministic local "AI" synthesis generator — no network calls required.
export function generateSynthesis(days: Day[], fromDay: number, toDay: number) {
  const inRange = days.filter((d) => d.dayNumber >= fromDay && d.dayNumber <= toDay)
  const topicCount = new Map<string, number>()
  const problems = inRange.flatMap((d) => d.problems)

  for (const p of problems) {
    topicCount.set(p.topic, (topicCount.get(p.topic) ?? 0) + 1)
  }

  const sortedTopics = [...topicCount.entries()].sort((a, b) => b[1] - a[1])
  const top = sortedTopics.slice(0, 2).map(([t]) => t)
  const weak = sortedTopics.slice(-2).map(([t]) => t)

  const easy = problems.filter((p) => p.difficulty === 'Easy').length
  const med = problems.filter((p) => p.difficulty === 'Medium').length
  const hard = problems.filter((p) => p.difficulty === 'Hard').length

  const body = problems.length
    ? `Across ${problems.length} problem${problems.length === 1 ? '' : 's'} in this range, your practice centered on ${top.join(' and ') || 'a mix of core topics'}. You solved ${easy} easy, ${med} medium, and ${hard} hard problems, showing steady coverage across the difficulty curve. Consider revisiting ${weak.join(' and ') || 'less-practiced topics'} to round out pattern recognition before moving to harder variants.`
    : `No problems were logged in this range yet. Add a day and a few problems to generate a meaningful synthesis.`

  const mastered = sortedTopics.slice(0, 2).map(([t, c]) => `${t} (${c} solved)`)
  const needsReview = sortedTopics.slice(-2).map(([t, c]) => `${t} (${c} solved)`)

  return { body, mastered, needsReview, easy, med, hard, total: problems.length }
}
