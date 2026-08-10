import { Search, Terminal, Settings } from 'lucide-react'
import { type ReactNode, useState, useRef, useEffect } from 'react'
import { useVault } from '@/lib/store'

export default function Topbar({
  title,
  subtitle,
  searchPlaceholder,
  onSearch,
  right,
}: {
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (q: string) => void
  right?: ReactNode
}) {
  const { user, logoutUser } = useVault()
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?'

  return (
    <header className="sticky top-0 z-20 border-b border-outline-variant bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-4">
        {title && (
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-on-surface truncate">{title}</h1>
            {subtitle && <p className="text-xs text-on-surface-variant mt-0.5 hidden sm:block">{subtitle}</p>}
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto">
          {searchPlaceholder && (
            <div className="relative hidden lg:block">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                onChange={(e) => onSearch?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-64 rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-8 pr-3 text-xs font-mono text-on-surface placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
          {right}
          <button className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" aria-label="Terminal">
            <Terminal size={17} strokeWidth={2} />
          </button>
          <button className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" aria-label="Settings">
            <Settings size={17} strokeWidth={2} />
          </button>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary-bright to-secondary ring-2 ring-outline-variant flex items-center justify-center text-on-primary font-bold shadow-sm transition-transform hover:scale-105"
            >
              {initial}
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl bg-surface-container border border-outline-variant shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant">Signed in as</p>
                  <p className="text-sm font-bold text-on-surface truncate">@{user?.username}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={logoutUser}
                    className="w-full text-left px-2 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
