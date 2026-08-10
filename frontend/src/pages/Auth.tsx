import { useState } from 'react'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'
import { apiLogin, apiRegister } from '@/lib/api'
import { useVault } from '@/lib/store'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useVault()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const data = await apiLogin(username, password)
        loginUser(data.data.user, data.data.token)
      } else {
        const data = await apiRegister(username, password)
        loginUser(data.data.user, data.data.token)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-bright/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <img
            src="/src/assets/optimal_logo.png"
            alt="Optimal.dev"
            className="h-24 mx-auto mb-2 object-contain"
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {isLogin ? 'Enter your details to access your vault.' : 'Sign up to start tracking your progress.'}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-surface-container/60 border border-outline-variant rounded-2xl p-8 shadow-2xl shadow-primary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="johndoe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-on-primary transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin relative z-10" />
              ) : isLogin ? (
                <>
                  <LogIn size={18} className="relative z-10" />
                  <span className="relative z-10">Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} className="relative z-10" />
                  <span className="relative z-10">Sign Up</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-sm text-primary hover:text-primary-bright font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
