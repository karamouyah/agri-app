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
    streetAddress: getProfileValue(user, 'street_address'),
    wilayaId: Number(getProfileValue(user, 'wilaya_id') || user.wilaya_id || 0) || '',
    communeId: Number(getProfileValue(user, 'commune_id') || user.commune_id || 0) || '',
    wilayaName: getProfileValue(user, 'wilaya_name') || user.wilaya_name || '',
    communeName: getProfileValue(user, 'commune_name') || user.commune_name || '',
    locationLabel: getProfileValue(user, 'location_label') || user.location_label || '',
    maxLoadKg: Number(getProfileValue(user, 'max_load_kg') || user.max_load_kg || 0) || '',
    deliveryWilayaIds: getProfileValue(user, 'delivery_wilaya_ids') || user.delivery_wilaya_ids || [],
    deliveryWilayas: getProfileValue(user, 'delivery_wilayas') || user.delivery_wilayas || [],
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
  const wilayaId = Number(payload.wilayaId || payload.wilaya_id || 0)
  const communeId = Number(payload.communeId || payload.commune_id || 0)
  const maxLoadKg = Number(payload.maxLoadKg || payload.max_load_kg || 0)
  const deliveryWilayaIds = Array.isArray(payload.deliveryWilayaIds || payload.delivery_wilaya_ids)
    ? [...new Set((payload.deliveryWilayaIds || payload.delivery_wilaya_ids).map(Number).filter(Boolean))]
    : []

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

  if (role === 'farmer' || role === 'buyer') {
    if (!wilayaId) throw new Error('Wilaya is required.')
    if (!communeId) throw new Error('Commune is required.')
  }

  if (role === 'transporter') {
    if (!vehicle) {
      throw new Error('Vehicle is required for Transporter signup.')
    }
    if (!Number.isFinite(maxLoadKg) || maxLoadKg <= 0) {
      throw new Error('Maximum load capacity in KG is required and must be greater than zero.')
    }
    if (deliveryWilayaIds.length === 0) {
      throw new Error('At least one delivery wilaya is required for Transporter signup.')
    }
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
    wilayaId,
    communeId,
    maxLoadKg,
    deliveryWilayaIds,
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
      wilaya_id: validated.wilayaId,
      commune_id: validated.communeId,
      max_load_kg: validated.maxLoadKg,
      delivery_wilaya_ids: validated.deliveryWilayaIds,
    },
  })

  return normalizeUser(created)
}
