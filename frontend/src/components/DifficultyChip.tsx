import type { Difficulty } from '@/lib/types'
import { difficultyStyles } from '@/lib/utils'

export default function DifficultyChip({ difficulty, size = 'sm' }: { difficulty: Difficulty; size?: 'sm' | 'md' }) {
  const s = difficultyStyles[difficulty]
  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-semibold ring-1 ${s.bg} ${s.text} ${s.ring} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {difficulty}
    </span>
  )
}
