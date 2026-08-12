import { NavLink } from 'react-router-dom'
import { LayoutGrid, History, Play, X } from 'lucide-react'
import { useVault } from '@/lib/store'
import logoUrl from '@/assets/optimal_logo.png'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/revision', label: 'Revision', icon: History, end: false },
]

export default function Sidebar() {
  const { stats, logoutUser, mobileSidebarOpen, setMobileSidebarOpen } = useVault()

  const renderContent = (isMobile: boolean) => (
    <>
      <div className="overflow-hidden flex items-center justify-between" style={{ height: '52px' }}>
        <img
          src={logoUrl}
          alt="Optimal.dev"
          style={{
            height: '100px',
            width: 'auto',
            marginTop: '-34px',
            marginBottom: '-34px',
            marginLeft: '-8px',
          }}
        />
        {isMobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>
      <p className="px-2 mt-2 mb-6 text-xs text-on-surface-variant font-mono-tight">
        Practice Streak: <span className="text-primary-bright font-semibold">{stats.streak} Days</span>
      </p>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => {
              if (isMobile) setMobileSidebarOpen(false)
            }}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/12 text-primary-bright ring-1 ring-primary/25'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`
            }
          >
            <Icon size={17} strokeWidth={2.1} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="speeder-container">
          <div className="clouds">
            <div className="cloud cloud1"></div>
            <div className="cloud cloud2"></div>
            <div className="cloud cloud3"></div>
            <div className="cloud cloud4"></div>
            <div className="cloud cloud5"></div>
          </div>

          <div className="loader">
            <span><span></span><span></span><span></span><span></span></span>
            <div className="base">
              <span></span>
              <div className="face"></div>
            </div>
          </div>

          <div className="longfazers">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>

        <a
          href="https://neetcode.io/practice"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (isMobile) setMobileSidebarOpen(false)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-on-primary transition-transform hover:brightness-110 active:scale-[0.98]"
        >
          <Play size={15} fill="currentColor" strokeWidth={0} />
          Start Practice
        </a>

        <button
          onClick={() => {
            if (isMobile) setMobileSidebarOpen(false)
            logoutUser()
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          Logout
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-5 h-screen sticky top-0">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Panel */}
          <aside className="relative flex w-64 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-5 h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  )
}
