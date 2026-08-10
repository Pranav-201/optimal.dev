import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container shadow-pop animate-scale-in">
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <h2 className="text-base font-semibold text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
