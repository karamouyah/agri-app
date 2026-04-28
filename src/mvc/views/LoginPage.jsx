// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
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
  // State: stores local UI data and is updated by event handlers or API responses.
  const [formData, setFormData] = useState({ email: '', password: '' })
  // State: stores local UI data and is updated by event handlers or API responses.
  const [error, setError] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }
  // handleChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  // handleSubmit handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
    <div className="min-h-screen px-4 py-6 md:px-6">
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
            <h1 className="mt-5 max-w-xl text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">
              Sign in to your workspace.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Use your approved account to continue with products, orders, deliveries, or oversight tasks based on your role.
            </p>

            <div className="mt-6 space-y-3">
              {trustPoints.map((item) => {
                const Icon = item.icon
                return (
                  <SoftCard key={item.text} className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-700">
                      <Icon />
                    </span>
                    <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                  </SoftCard>
                )
              })}
            </div>

            <Card className="mt-6 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Workspaces</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>Farmers manage listings, orders, and revenue.</p>
                <p>Buyers browse approved products and track purchases.</p>
                <p>Transporters monitor missions and delivery status.</p>
                <p>Ministry users review approvals, catalog changes, and reports.</p>
              </div>
            </Card>
          </Card>

          <Card className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Account Login</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Enter the credentials linked to your approved account.</p>

            {notice ? (
              <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
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

              {error ? <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">{error}</div> : null}

              <button type="submit" disabled={loading} className={`${buttonStyles.primary} w-full`}>
                <FiLogIn />
                {loading ? 'Signing In...' : 'Sign In'}
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


