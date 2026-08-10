import { NavLink } from 'react-router-dom'
import { LayoutGrid, History } from 'lucide-react'

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-outline-variant bg-surface-container-lowest/95 backdrop-blur px-4 py-2 flex justify-around">
      {[
        { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
        { to: '/revision', label: 'Revision', icon: History, end: false },
      ].map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-[11px] font-medium ${
              isActive ? 'text-primary-bright' : 'text-on-surface-variant'
            }`
          }
        >
          <Icon size={19} strokeWidth={2.1} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
