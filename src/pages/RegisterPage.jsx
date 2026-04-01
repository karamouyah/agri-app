import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerUser } from '../mvc/controllers/authController'

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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface-card w-full max-w-md p-7">
        <h1 className="text-2xl font-bold text-emerald-800">Create Account</h1>
        <p className="mt-1 text-sm text-slate-500">Join AgriGov Market in a few steps.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="field-control w-full px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="field-control w-full px-3 py-2"
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="transporter">Transporter</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="field-control w-full px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
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
              className="field-control w-full px-3 py-2"
            />
          </div>

          {roleConfig.requiresPhone && (
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
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
                className="field-control w-full px-3 py-2"
              />
            </div>
          )}

          {roleConfig.extraField && (
            <div>
              <label
                htmlFor={roleConfig.extraField.id}
                className="mb-1 block text-sm font-medium text-slate-700"
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
                className="field-control w-full px-3 py-2"
              />
              {formData.role === 'farmer' && (
                <p className="mt-1 text-xs text-slate-500">
                  Each farm address can only be registered once.
                </p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full px-4 py-2.5 disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emerald-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
