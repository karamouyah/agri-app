// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiFeather, FiShield, FiTruck, FiUserPlus } from 'react-icons/fi'
import { register as registerUser } from '../controllers/authController'
import BrandLogo from '../../components/BrandLogo'
import LocationFields from '../../components/LocationFields'
import ThemeToggle from '../../components/ThemeToggle'
import WilayaMultiSelect from '../../components/WilayaMultiSelect'
import { Card, FormField, Input, Select, SoftCard, buttonStyles } from '../../components/ui'

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
  wilayaId: '',
  communeId: '',
  maxLoadKg: '',
  deliveryWilayaIds: [],
}

const roleLabels = {
  farmer: 'Farmer',
  transporter: 'Transporter',
  buyer: 'Buyer',
}

const roleFieldConfig = {
  farmer: {
    requiresPhone: true,
    addressField: {
      id: 'farmAddress',
      label: 'Farm Address',
      placeholder: 'Registered farm address',
      requiredMessage: 'Farm address is required for Farmer signup.',
    },
  },
  transporter: {
    requiresPhone: true,
    vehicleField: {
      id: 'vehicle',
      label: 'Vehicle Type',
      placeholder: 'Truck, refrigerated van, pickup...',
      requiredMessage: 'Vehicle is required for Transporter signup.',
    },
  },
  buyer: {
    requiresPhone: true,
    addressField: {
      id: 'address',
      label: 'Address',
      placeholder: 'Business or delivery address',
      requiredMessage: 'Address is required for Buyer signup.',
    },
  },
}

const trustPoints = [
  { icon: FiShield, text: 'Every new account is reviewed before marketplace access is approved.' },
  { icon: FiFeather, text: 'Farmers register product and farm details so listings can be linked to a real origin.' },
  { icon: FiTruck, text: 'Transporters declare vehicle type, capacity, and delivery wilayas during onboarding.' },
  { icon: FiClock, text: 'Buyers and farmers provide wilaya and commune data so orders and deliveries can be routed correctly.' },
]

// validateForm handles this module workflow, using its parameters and returning JSX, data, or a service result.
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

  if (config.addressField && !String(formData[config.addressField.id] || '').trim()) {
    return config.addressField.requiredMessage
  }

  if (formData.role === 'farmer' || formData.role === 'buyer') {
    if (!String(formData.wilayaId || '').trim()) return 'Wilaya is required.'
    if (!String(formData.communeId || '').trim()) return 'Commune is required.'
  }

  if (formData.role === 'transporter') {
    if (!String(formData.vehicle || '').trim()) return 'Vehicle is required for Transporter signup.'
    if (Number(formData.maxLoadKg) <= 0) return 'Maximum load capacity in KG is required and must be greater than zero.'
    if (!formData.deliveryWilayaIds.length) return 'At least one delivery wilaya is required for Transporter signup.'
  }

  return ''
}

export default function RegisterPage() {
  const navigate = useNavigate()
  // State: stores local UI data and is updated by event handlers or API responses.
  const [formData, setFormData] = useState(initialForm)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(false)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [error, setError] = useState('')

  const roleConfig = useMemo(
    () => roleFieldConfig[formData.role] || roleFieldConfig.farmer,
    [formData.role],
  )
  // handleChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleChange = (event) => {
    const { name, value } = event.target
    setError('')
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'wilayaId' ? { communeId: '' } : {}),
    }))
  }
  // handleSubmit handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const validationMessage = validateForm(formData)
      if (validationMessage) {
        setError(validationMessage)
        return
      }

      setLoading(true)
      await registerUser(formData)
      navigate('/login', {
        replace: true,
        state: { notice: APPROVAL_NOTICE },
      })
    } catch (submitError) {
      console.error('Registration Runtime Error:', submitError)
      alert(`Registration failed: ${submitError.message || 'Unknown error occurred'}`)
      setError(submitError.message || 'Failed to submit registration.')
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
              Ministry-reviewed onboarding
            </p>
            <h1 className="mt-5 max-w-xl text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">
              Create an account for your role.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Provide the required contact, location, and role details so your account can be reviewed and approved.
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
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Approval Flow</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>1. Submit your role details.</p>
                <p>2. Ministry staff review the account.</p>
                <p>3. Sign in after approval.</p>
              </div>
            </Card>
          </Card>

          <Card className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Create Account</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Role-based signup</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The form updates based on the role you choose.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormField label="Full Name">
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
              </FormField>

              <FormField label="Role">
                <Select id="role" name="role" value={formData.role} onChange={handleChange}>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="transporter">Transporter</option>
                </Select>
              </FormField>

              <FormField label="Email">
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
              </FormField>

              <FormField label="Password">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={10}
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormField>

              {roleConfig.requiresPhone ? (
                <FormField label="Phone Number">
                  <Input
                    id="phone"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 555 123 4567"
                  />
                </FormField>
              ) : null}

              {roleConfig.addressField ? (
                <FormField
                  label={roleConfig.addressField.label}
                  hint={formData.role === 'farmer' ? 'Each farm address can only be registered once.' : ''}
                >
                  <Input
                    id={roleConfig.addressField.id}
                    name={roleConfig.addressField.id}
                    required
                    value={formData[roleConfig.addressField.id]}
                    onChange={handleChange}
                    placeholder={roleConfig.addressField.placeholder}
                  />
                </FormField>
              ) : null}

              {(formData.role === 'farmer' || formData.role === 'buyer') && (
                <LocationFields
                  wilayaId={formData.wilayaId}
                  communeId={formData.communeId}
                  onChange={handleChange}
                  hint={
                    formData.role === 'farmer'
                      ? 'The selected commune must belong to the chosen wilaya.'
                      : 'Buyers must register with a valid Algeria wilaya and commune.'
                  }
                />
              )}

              {formData.role === 'transporter' ? (
                <>
                  <FormField label={roleConfig.vehicleField.label}>
                    <Input
                      id={roleConfig.vehicleField.id}
                      name={roleConfig.vehicleField.id}
                      required
                      value={formData[roleConfig.vehicleField.id]}
                      onChange={handleChange}
                      placeholder={roleConfig.vehicleField.placeholder}
                    />
                  </FormField>

                  <FormField label="Maximum Load Capacity (KG)">
                    <Input
                      id="maxLoadKg"
                      name="maxLoadKg"
                      type="number"
                      min="1"
                      required
                      value={formData.maxLoadKg}
                      onChange={handleChange}
                      placeholder="2500"
                    />
                  </FormField>

                  <WilayaMultiSelect
                    selectedIds={formData.deliveryWilayaIds}
                    onChange={(deliveryWilayaIds) => setFormData((prev) => ({ ...prev, deliveryWilayaIds }))}
                  />
                </>
              ) : null}

              <FormField label="Verification Documents (ID/License)">
                <div>
                  <input
                    id="doc-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="doc-upload"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-emerald-500 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700"
                  >
                    Upload ID Documents
                  </label>
                </div>
                {formData.documents.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.documents.map((file, idx) => (
                      <div key={idx} className="relative h-[80px] w-[80px] overflow-hidden rounded-md border border-slate-200 shadow-sm">
                        <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeDocument(idx)}
                          className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center bg-black/60 text-white hover:bg-rose-600 rounded-bl-md"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FormField>

              {error ? <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">{error}</div> : null}

              <button type="submit" disabled={loading} className={`${buttonStyles.primary} w-full`}>
                <FiUserPlus />
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}


