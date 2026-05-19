// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiCheckCircle, 
  FiShield, 
  FiTruck, 
  FiUserPlus, 
  FiUploadCloud, 
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiMail,
  FiHash,
  FiPhone,
  FiMapPin,
  FiXCircle
} from 'react-icons/fi'
import { register as registerUser } from '../controllers/authController'
import BrandLogo from '../../components/BrandLogo'
import LocationFields from '../../components/LocationFields'
import ThemeToggle from '../../components/ThemeToggle'
import WilayaMultiSelect from '../../components/WilayaMultiSelect'
import { Card, FormField, Input } from '../../components/ui'

const PHONE_REGEX = /^\+?[0-9()\-\s]{7,20}$/
const APPROVAL_NOTICE = 'Your account has been created and is waiting for ministry approval.'

const initialForm = {
  name: '',
  role: 'farmer',
  nationalId: '',
  email: '',
  password: '',
  confirmPassword: '',
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

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [nationalIdImage, setNationalIdImage] = useState(null)
  const [agriculturalCardImage, setAgriculturalCardImage] = useState(null)
  const [transportLicenseImage, setTransportLicenseImage] = useState(null)

  const [nationalIdPreview, setNationalIdPreview] = useState(null)
  const [agriculturalCardPreview, setAgriculturalCardPreview] = useState(null)
  const [transportLicensePreview, setTransportLicensePreview] = useState(null)
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const roleConfig = useMemo(
    () => roleFieldConfig[formData.role] || roleFieldConfig.farmer,
    [formData.role],
  )

  useEffect(() => {
    return () => {
      if (nationalIdPreview) URL.revokeObjectURL(nationalIdPreview)
      if (agriculturalCardPreview) URL.revokeObjectURL(agriculturalCardPreview)
      if (transportLicensePreview) URL.revokeObjectURL(transportLicensePreview)
    }
  }, [nationalIdPreview, agriculturalCardPreview, transportLicensePreview])

  const handleChange = (event) => {
    const { name, value } = event.target
    setError('')
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'wilayaId' ? { communeId: '' } : {}),
    }))
  }

  const handleRoleSelect = (selectedRole) => {
    setError('')
    setFormData(prev => ({ ...prev, role: selectedRole }))
    // Reset specific images when role changes to enforce exact slots
    setNationalIdImage(null)
    setAgriculturalCardImage(null)
    setTransportLicenseImage(null)
    setNationalIdPreview(null)
    setAgriculturalCardPreview(null)
    setTransportLicensePreview(null)
  }

  const validateAndSetFile = (file, setter, previewSetter, label) => {
    setError('')
    if (!file) {
      setter(null)
      previewSetter(null)
      return
    }

    if (file.type === 'application/pdf') {
      setError(`PDF files are strictly not allowed for ${label}. Please upload an image.`)
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(`Only JPEG, PNG, and WebP images are allowed for ${label}.`)
      return
    }

    setter(file)
    previewSetter(URL.createObjectURL(file))
  }

  const checkValidation = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.role) {
      return 'Name, email, password, and role are required.'
    }
    if (!formData.nationalId.trim()) {
      return 'National ID Number (رقم التعريف الوطني) is required.'
    }
    if (formData.password.length < 10) {
      return 'Password must be at least 10 characters.'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.'
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationMessage = checkValidation()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setLoading(true)

      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('password', formData.password)
      submitData.append('role', formData.role)
      submitData.append('national_id', formData.nationalId)
      submitData.append('phone_number', formData.phoneNumber)

      if (formData.role === 'farmer') {
        submitData.append('farm_name', formData.farmName || '')
        submitData.append('farm_address', formData.farmAddress || '')
        submitData.append('wilaya_id', formData.wilayaId || '')
        submitData.append('commune_id', formData.communeId || '')
        submitData.append('national_id_image', nationalIdImage)
        submitData.append('agricultural_card_image', agriculturalCardImage)
      }

      if (formData.role === 'buyer') {
        submitData.append('address', formData.address || '')
        submitData.append('wilaya_id', formData.wilayaId || '')
        submitData.append('commune_id', formData.communeId || '')
        submitData.append('national_id_image', nationalIdImage)
      }

      if (formData.role === 'transporter') {
        submitData.append('vehicle', formData.vehicle || '')
        submitData.append('max_load_kg', formData.maxLoadKg || '')
        if (formData.deliveryWilayaIds) {
          formData.deliveryWilayaIds.forEach((id) => {
            submitData.append('delivery_wilaya_ids', id)
          })
        }
        submitData.append('national_id_image', nationalIdImage)
        submitData.append('transport_license_image', transportLicenseImage)
      }

      await registerUser(submitData)
      navigate('/login', {
        replace: true,
        state: { notice: APPROVAL_NOTICE },
      })
    } catch (submitError) {
      console.error('Registration Runtime Error:', submitError)
      setError(submitError.response?.data?.message || submitError.message || 'Failed to submit registration.')
    } finally {
      setLoading(false)
    }
  }

  let isSubmitDisabled = loading
  if (formData.role === 'farmer') {
    if (!nationalIdImage || !agriculturalCardImage) isSubmitDisabled = true
  } else if (formData.role === 'transporter') {
    if (!nationalIdImage || !transportLicenseImage) isSubmitDisabled = true
  } else if (formData.role === 'buyer') {
    if (!nationalIdImage) isSubmitDisabled = true
  }

  const renderUploadSlot = (file, preview, setter, previewSetter, label) => {
    return (
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors overflow-hidden ${
          file 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-emerald-300 hover:border-emerald-500 dark:border-emerald-700 dark:hover:border-emerald-500 bg-white/50 dark:bg-slate-800/50'
        }`}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          accept="image/jpeg, image/png, image/webp" 
          onChange={(e) => {
            const f = e.target.files[0]
            validateAndSetFile(f, setter, previewSetter, label)
            e.target.value = ''
          }} 
        />
        {preview ? (
          <div className="flex flex-col items-center z-0">
            <img src={preview} alt={label} className="w-24 h-24 object-cover rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-700 mb-3" />
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium text-sm text-center">
              <FiCheckCircle /> {label} Selected
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center z-0">
            <FiUploadCloud className="text-3xl text-emerald-500 mb-3" />
            <span className="text-emerald-800 dark:text-emerald-400 font-semibold mb-1 text-sm">{label}</span>
            <span className="text-xs text-slate-500 mt-1 font-bold">JPEG, PNG, WebP only. No PDFs.</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 bg-slate-50 dark:bg-slate-900">
      <div className="relative mx-auto max-w-4xl">
        <div className="mb-4 flex justify-between items-center">
          <BrandLogo size="md" />
          <ThemeToggle />
        </div>
        
        <Card className="p-6 md:p-8 shadow-xl border-emerald-900/10 dark:border-emerald-500/20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
          <h1 className="text-3xl font-bold text-center mb-2 text-emerald-900 dark:text-emerald-400">
            Join AgriGov Market
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Select your role to begin the registration process
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Highly Visible Glassmorphic Role Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {Object.entries(roleLabels).map(([roleKey, roleLabel]) => {
                const isActive = formData.role === roleKey
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => handleRoleSelect(roleKey)}
                    className={`
                      relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-200 ease-in-out
                      flex flex-col items-center justify-center gap-2
                      ${isActive 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-md shadow-emerald-500/20' 
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700'}
                    `}
                  >
                    {isActive && <div className="absolute top-2 right-2 text-emerald-500"><FiCheckCircle size={20} /></div>}
                    <span className="text-lg font-semibold">{roleLabel}</span>
                  </button>
                )
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField label="Full Name" icon={FiUser}>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500" />
              </FormField>

              <FormField label="Email Address" icon={FiMail}>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500" />
              </FormField>

              <FormField label="National ID Number (رقم التعريف الوطني)" icon={FiHash}>
                <Input 
                  id="nationalId" 
                  name="nationalId" 
                  required 
                  value={formData.nationalId} 
                  onChange={handleChange}
                  placeholder="e.g. 1029384756"
                  className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
                />
              </FormField>

              <div className="hidden md:block" />

              <FormField label="Password" icon={FiLock}>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={10}
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-12 border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
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

              <FormField label="Confirm Password" icon={FiLock}>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={10}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pr-12 border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </FormField>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                {roleLabels[formData.role]} Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {roleConfig.requiresPhone ? (
                  <FormField label="Phone Number" icon={FiPhone}>
                    <Input
                      id="phone"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+213..."
                      className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
                    />
                  </FormField>
                ) : null}

                {roleConfig.addressField ? (
                  <FormField label={roleConfig.addressField.label} icon={FiMapPin}>
                    <Input
                      id={roleConfig.addressField.id}
                      name={roleConfig.addressField.id}
                      required
                      value={formData[roleConfig.addressField.id]}
                      onChange={handleChange}
                      placeholder={roleConfig.addressField.placeholder}
                      className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
                    />
                  </FormField>
                ) : null}
              </div>

              <div className="mt-4">
                {(formData.role === 'farmer' || formData.role === 'buyer') && (
                  <LocationFields
                    wilayaId={formData.wilayaId}
                    communeId={formData.communeId}
                    onChange={handleChange}
                  />
                )}
              </div>

              {formData.role === 'transporter' ? (
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <FormField label={roleConfig.vehicleField.label} icon={FiTruck}>
                    <Input
                      id={roleConfig.vehicleField.id}
                      name={roleConfig.vehicleField.id}
                      required
                      value={formData[roleConfig.vehicleField.id]}
                      onChange={handleChange}
                      placeholder={roleConfig.vehicleField.placeholder}
                      className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
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
                      className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500"
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <WilayaMultiSelect
                      selectedIds={formData.deliveryWilayaIds}
                      onChange={(deliveryWilayaIds) => setFormData((prev) => ({ ...prev, deliveryWilayaIds }))}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Dynamic Enforced Role-Based Document Slots */}
            <div className="border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-400 flex items-center gap-2 mb-4">
                <FiShield /> Identity Verification ({roleLabels[formData.role]})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderUploadSlot(nationalIdImage, nationalIdPreview, setNationalIdImage, setNationalIdPreview, 'National ID Card Picture')}
                
                {formData.role === 'farmer' && (
                  renderUploadSlot(agriculturalCardImage, agriculturalCardPreview, setAgriculturalCardImage, setAgriculturalCardPreview, 'Agricultural Card Picture')
                )}
                
                {formData.role === 'transporter' && (
                  renderUploadSlot(transportLicenseImage, transportLicensePreview, setTransportLicenseImage, setTransportLicensePreview, 'Commercial Transport License Picture')
                )}
              </div>
            </div>

            {error ? (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-lg text-sm shadow-sm">
                <FiXCircle className="shrink-0 text-lg" />
                <p className="font-medium">{error}</p>
              </div>
            ) : null}

            <button 
              type="submit" 
              disabled={isSubmitDisabled} 
              className={`
                w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-lg transition-all
                ${isSubmitDisabled 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500 shadow-none' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'}
              `}
            >
              <FiUserPlus />
              {loading ? 'Processing...' : 'Create Account'}
            </button>
            {isSubmitDisabled && !loading && (
              <p className="text-center text-sm text-slate-500 mt-2 font-medium">
                * You must upload all required verification pictures for {roleLabels[formData.role]} to proceed.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300">
              Sign in securely
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
