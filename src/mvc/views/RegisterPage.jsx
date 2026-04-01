import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiFeather, FiShield, FiTruck } from 'react-icons/fi'
import { register as registerUser } from '../controllers/authController'

const PHONE_REGEX = /^\+?[0-9()\-\s]{7,20}$/
const APPROVAL_NOTICE = 'Your account has been created and is waiting for ministry approval.'

const initialForm = {
  name: '',
  role: 'farmer',
  email: '',
  password: '',
  phoneNumber: '',
  farmAddress: '',
  vehicle: '',
  address: '',
}

const roleLabels = {
  farmer: 'Farmer',
  transporter: 'Transporter',
  buyer: 'Buyer',
}

const roleFieldConfig = {
  farmer: {
    requiresPhone: true,
    extraField: {
      id: 'farmAddress',
      label: 'Farm Address',
      placeholder: 'Farm address (must be unique)',
      requiredMessage: 'Farm address is required for Farmer signup.',
    },
  },
  transporter: {
    requiresPhone: true,
    extraField: {
      id: 'vehicle',
      label: 'Vehicle',
      placeholder: 'Vehicle type/plate',
      requiredMessage: 'Vehicle is required for Transporter signup.',
    },
  },
  buyer: {
    requiresPhone: true,
    extraField: {
      id: 'address',
      label: 'Address',
      placeholder: 'Buyer address',
      requiredMessage: 'Address is required for Buyer signup.',
    },
  },
}

const validateForm = (formData) => {
  if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.role) {
    return 'Name, email, password, and role are required.'
  }

  if (formData.password.length < 10) {
    return 'Password must be at least 10 characters.'
  }

  const config = roleFieldConfig[formData.role] || roleFieldConfig.farmer

  if (config.requiresPhone) {
    const phoneNumber = formData.phoneNumber.trim()
    const roleLabel = roleLabels[formData.role] || 'Selected role'
    if (!phoneNumber) return `Phone number is required for ${roleLabel} signup.`
    if (!PHONE_REGEX.test(phoneNumber)) return 'Enter a valid phone number.'
  }

  if (config.extraField && !String(formData[config.extraField.id] || '').trim()) {
    return config.extraField.requiredMessage
  }

  return ''
}

const trustPoints = [
  {
    icon: FiShield,
    text: 'Every new account is reviewed by the ministry before activation.',
  },
  {
    icon: FiFeather,
    text: 'Role-specific onboarding for farmers, buyers, and transporters.',
  },
  {
    icon: FiTruck,
    text: 'Clean flow from farm listing to delivery and fulfillment.',
  },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const roleConfig = useMemo(
    () => roleFieldConfig[formData.role] || roleFieldConfig.farmer,
    [formData.role],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationMessage = validateForm(formData)
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setLoading(true)
    try {
      await registerUser(formData)
      navigate('/login', {
        replace: true,
        state: { notice: APPROVAL_NOTICE },
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <aside className="surface-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-14 -top-12 h-52 w-52 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-lime-200/50 blur-3xl" />

          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <FiCheckCircle />
              Ministry-verified onboarding
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Join the modern
              <span className="block text-emerald-700">agri-tech marketplace</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              Create your professional account to collaborate across agriculture, logistics, and marketplace
              operations.
            </p>

            <div className="mt-6 space-y-3">
              {trustPoints.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.text} className="surface-muted flex items-center gap-3 px-3 py-2.5 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Icon />
                    </span>
                    <span className="text-slate-700">{item.text}</span>
                  </article>
                )
              })}
            </div>
          </div>
        </aside>

        <section className="surface-card p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Create Account</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Role-based signup</h2>
            <p className="mt-1 text-sm text-slate-600">Fill your profile details according to your role.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="field-control w-full px-3 py-2.5"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-semibold text-slate-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="field-control w-full px-3 py-2.5"
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="transporter">Transporter</option>
              </select>
            </div>

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
                minLength={10}
                value={formData.password}
                onChange={handleChange}
                className="field-control w-full px-3 py-2.5"
              />
            </div>

            {roleConfig.requiresPhone && (
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 555 123 4567"
                  className="field-control w-full px-3 py-2.5"
                />
              </div>
            )}

            {roleConfig.extraField && (
              <div>
                <label
                  htmlFor={roleConfig.extraField.id}
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  {roleConfig.extraField.label}
                </label>
                <input
                  id={roleConfig.extraField.id}
                  name={roleConfig.extraField.id}
                  required
                  value={formData[roleConfig.extraField.id]}
                  onChange={handleChange}
                  placeholder={roleConfig.extraField.placeholder}
                  className="field-control w-full px-3 py-2.5"
                />
                {formData.role === 'farmer' && (
                  <p className="mt-1 text-xs text-slate-500">Each farm address can only be registered once.</p>
                )}
              </div>
            )}

            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
