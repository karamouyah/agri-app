import { apiRequest, setStoredTokens } from './apiClient'

const PHONE_REGEX = /^\+?[0-9()\-\s]{7,20}$/

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '')

const ROLE_LABELS = {
  farmer: 'Farmer',
  buyer: 'Buyer',
  transporter: 'Transporter',
  ministry: 'Ministry',
}
const SIGNUP_ROLES = ['farmer', 'buyer', 'transporter']

const getProfileValue = (user, key) => user?.profile?.[key] || user?.[key] || ''

const normalizeUser = (user) => {
  const phoneNumber = getProfileValue(user, 'phone_number') || getProfileValue(user, 'phone')

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    approvalStatus: user.approval_status || 'pending',
    farmName: user.farm_name || '',
    farmAddress: getProfileValue(user, 'farm_address'),
    phoneNumber,
    phone: phoneNumber,
    vehicle: getProfileValue(user, 'vehicle'),
    address: getProfileValue(user, 'address'),
    profile: user.profile || null,
  }
}

const validateRegistrationPayload = (payload) => {
  const name = normalizeText(payload.name)
  const email = normalizeText(payload.email)
  const password = payload.password || ''
  const role = normalizeText(payload.role || 'farmer')
  const phoneNumber = normalizeText(payload.phoneNumber || payload.phone)
  const farmAddress = normalizeText(payload.farmAddress)
  const vehicle = normalizeText(payload.vehicle)
  const address = normalizeText(payload.address)

  if (!name || !email || !password || !role) {
    throw new Error('Name, email, password, and role are required.')
  }

  if (password.length < 10) {
    throw new Error('Password must be at least 10 characters.')
  }

  if (!SIGNUP_ROLES.includes(role)) {
    throw new Error('Invalid signup role selected.')
  }

  const requiresPhone = ['farmer', 'buyer', 'transporter'].includes(role)
  const roleName = ROLE_LABELS[role] || 'Selected role'

  if (requiresPhone) {
    if (!phoneNumber) {
      throw new Error(`Phone number is required for ${roleName} signup.`)
    }
    if (!PHONE_REGEX.test(phoneNumber)) {
      throw new Error('Enter a valid phone number.')
    }
  }

  if (role === 'farmer' && !farmAddress) {
    throw new Error('Farm address is required for Farmer signup.')
  }

  if (role === 'transporter' && !vehicle) {
    throw new Error('Vehicle is required for Transporter signup.')
  }

  if (role === 'buyer' && !address) {
    throw new Error('Address is required for Buyer signup.')
  }

  return {
    name,
    email,
    password,
    role,
    farmName: normalizeText(payload.farmName),
    phoneNumber,
    farmAddress,
    vehicle,
    address,
  }
}

export const loginUser = async (credentials) => {
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required.')
  }

  const payload = await apiRequest('/auth/login/', {
    method: 'POST',
    body: {
      email: credentials.email,
      password: credentials.password,
    },
  })

  setStoredTokens({ access: payload.access, refresh: payload.refresh })
  return normalizeUser(payload.user)
}

export const registerUser = async (payload) => {
  const validated = validateRegistrationPayload(payload)

  const created = await apiRequest('/auth/register/', {
    method: 'POST',
    body: {
      name: validated.name,
      email: validated.email,
      password: validated.password,
      role: validated.role,
      farm_name: validated.farmName,
      phone_number: validated.phoneNumber,
      farm_address: validated.farmAddress,
      vehicle: validated.vehicle,
      address: validated.address,
    },
  })

  return normalizeUser(created)
}
