import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiLogIn, FiShield, FiTruck, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getDashboardPath } from '../../utils/roleRoutes'
import BrandLogo from '../../components/BrandLogo'
import ThemeToggle from '../../components/ThemeToggle'
import {
  Card,
  FormField,
  Input,
  SoftCard,
  buttonStyles,
} from '../../components/ui'

const trustPoints = [
  { icon: FiUser, text: 'Use the same approved account to access farmer, buyer, transporter, or ministry tools based on your role.' },
  { icon: FiClock, text: 'If your account is still waiting for approval, sign-in confirms your status and keeps your workspace access controlled.' },
  { icon: FiTruck, text: 'Orders, delivery missions, and marketplace activity stay tied to the correct user workflow after sign-in.' },
  { icon: FiShield, text: 'Authentication protects product management, invoices, approvals, and moderation actions.' },
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
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(167,243,208,0.4),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(236,253,245,0.85),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.7),_transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <Card className="overflow-hidden p-6 md:p-8">
            <BrandLogo size="sm" />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              <FiCheckCircle />
              Secure platform access
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight text-slate-900">
              Sign in to continue your marketplace work.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Access your role-based dashboard to manage products, orders, deliveries, approvals, or reports according to your account permissions.
            </p>

            <div className="mt-6 space-y-3">
              {trustPoints.map((item) => {
                const Icon = item.icon
                return (
                  <SoftCard key={item.text} className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-700">
                      <Icon />
                    </span>
                    <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                  </SoftCard>
                )
              })}
            </div>

            <Card className="mt-6 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">After Sign-In</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>Farmers open product, stock, order, and revenue tools.</p>
                <p>Buyers can browse approved listings, place orders, and review invoices.</p>
                <p>Transporters see available missions and active deliveries.</p>
                <p>Ministry users manage approvals, products, and reporting.</p>
              </div>
            </Card>
          </Card>

          <Card className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Account Login</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">Use your approved account credentials to open your workspace.</p>

            {notice ? (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                {notice}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormField label="Email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@agrigov.com"
                />
              </FormField>

              <FormField label="Password">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={4}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </FormField>

              {error ? <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">{error}</div> : null}

              <button type="submit" disabled={loading} className={`${buttonStyles.primary} w-full`}>
                <FiLogIn />
                {loading ? 'Signing In...' : 'Login'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-600">
              New to the platform?{' '}
              <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
                Create account
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
