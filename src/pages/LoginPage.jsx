import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/roleRoutes'
import { Card, Input, Button, buttonStyles, FormField } from '../components/ui'
import BrandLogo from '../components/BrandLogo'

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
      const from = location.state?.from?.pathname
      navigate(getDashboardPath(loggedIn.role), { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 sm:p-8 relative">
        <div className="mb-8 flex justify-center">
          <BrandLogo size="md" />
        </div>
        
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Log in to your account</p>
        </div>
        
        {notice && <div className="mb-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">{notice}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email address">
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
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
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </FormField>

          {error && <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`${buttonStyles.primary} w-full mt-2`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
            Sign up
          </Link>
        </p>

        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-xs text-slate-500 dark:text-slate-500">
            Tip: use email patterns containing <span className="font-medium">farmer, buyer, transporter, </span> or <span className="font-medium">ministry</span> mapped to respective roles.
          </p>
        </div>
      </Card>
    </div>
  )
}
