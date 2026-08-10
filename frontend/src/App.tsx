import { Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import Dashboard from '@/pages/Dashboard'
import DayDetail from '@/pages/DayDetail'
import ProblemDetail from '@/pages/ProblemDetail'
import Revision from '@/pages/Revision'
import Auth from '@/pages/Auth'
import { useVault } from '@/lib/store'

export default function App() {
  const { user } = useVault()

  if (!user) {
    return <Auth />
  }
  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/day/:dayId" element={<DayDetail />} />
          <Route path="/day/:dayId/problem/:problemId" element={<ProblemDetail />} />
          <Route path="/revision" element={<Revision />} />
        </Routes>
      </div>
      <MobileNav />
    </div>
  )
}
