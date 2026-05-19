// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getEntryPath } from '../../utils/roleRoutes'
import BrandLogo from '../../components/BrandLogo'
import ThemeToggle from '../../components/ThemeToggle'
import { Card, FormField, Input } from '../../components/ui'

export default function LoginPage() {
  const { isAuthenticated, user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const notice = location.state?.notice || ''
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={getEntryPath(user)} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const loggedIn = await login(formData)
      navigate(getEntryPath(loggedIn), { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[480px]">
        <div className="mb-8 flex justify-between items-center">
          <BrandLogo size="md" />
          <ThemeToggle />
        </div>

        <Card className="p-6 md:p-10 shadow-xl border-emerald-900/10 dark:border-emerald-500/20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to manage your agriculture workspace
            </p>
          </div>

          {notice && (
            <div className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Email Address" icon={FiMail}>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@agrigov.com"
                className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
              />
            </FormField>

            <FormField label="Password" icon={FiLock}>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={4}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </FormField>

            {error && (
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-lg transition-all
                ${loading 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'}
              `}
            >
              <FiLogIn />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300">
              Register now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
