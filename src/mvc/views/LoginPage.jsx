import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiFeather, FiShield, FiTruck } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getDashboardPath } from '../../utils/roleRoutes'

const trustPoints = [
  { icon: FiFeather, text: 'Fresh-produce marketplace workflows' },
  { icon: FiTruck, text: 'Integrated logistics and delivery tracking' },
  { icon: FiShield, text: 'Ministry-controlled approvals and trust' },
]

export default function LoginPage() {
  const { isAuthenticated, user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const notice = location.state?.notice || ''
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const loggedIn = await login(formData)
      navigate(getDashboardPath(loggedIn.role), { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="surface-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-12 -top-10 h-48 w-48 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="absolute -bottom-14 -left-10 h-56 w-56 rounded-full bg-lime-200/55 blur-3xl" />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <FiCheckCircle />
              AgriGov Secure Access
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Welcome back to the
              <span className="block text-emerald-700">Agri Marketplace Hub</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
              Sign in to manage agricultural operations, marketplace activity, and logistics flows with a
              trusted, ministry-supervised platform.
            </p>

            <div className="mt-6 space-y-3">
              {trustPoints.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.text} className="surface-muted flex items-center gap-3 px-3 py-2.5 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Icon />
                    </span>
                    <span className="text-slate-700">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        <section className="surface-card p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Account Login</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Sign in to your workspace</h2>
            <p className="mt-1 text-sm text-slate-600">Use your approved account to continue.</p>
            {notice && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="field-control w-full px-3 py-2.5"
                placeholder="you@agri.gov"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={4}
                value={formData.password}
                onChange={handleChange}
                className="field-control w-full px-3 py-2.5"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            New to the platform?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
