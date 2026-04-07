import { apiRequest } from './apiClient'

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  approvalStatus: user.approval_status,
  profile: user.profile || null,
  phoneNumber: user.phone_number || user.profile?.phone_number || '',
  farmAddress: user.farm_address || user.profile?.farm_address || '',
  vehicle: user.vehicle || user.profile?.vehicle || '',
  address: user.address || user.profile?.address || '',
  wilayaId: Number(user.wilaya_id || user.profile?.wilaya_id || 0) || '',
  wilayaName: user.wilaya_name || user.profile?.wilaya_name || '',
  communeId: Number(user.commune_id || user.profile?.commune_id || 0) || '',
  communeName: user.commune_name || user.profile?.commune_name || '',
  locationLabel: user.location_label || user.profile?.location_label || '',
  maxLoadKg: Number(user.max_load_kg || user.profile?.max_load_kg || 0) || '',
  deliveryWilayas: user.delivery_wilayas || user.profile?.delivery_wilayas || [],
  deliveryWilayaIds: user.delivery_wilaya_ids || user.profile?.delivery_wilaya_ids || [],
})

export const getNationalStats = () => apiRequest('/auth/admin/stats/')

export const getUsers = async (filters = {}) => {
  const search = new URLSearchParams()
  if (filters.role) search.set('role', filters.role)
  if (filters.approvalStatus) search.set('approval_status', filters.approvalStatus)
  if (filters.wilaya) search.set('wilaya', filters.wilaya)
  const query = search.toString()
  const users = await apiRequest(`/auth/admin/users/${query ? `?${query}` : ''}`)
  return users.map(normalizeUser)
}

export const getPendingUsers = async () => {
  const users = await apiRequest('/auth/admin/users/pending/')
  return users.map(normalizeUser)
}

export const approveUser = async (id) => {
  const user = await apiRequest(`/auth/admin/users/${id}/approve/`, { method: 'POST' })
  return normalizeUser(user)
}

export const rejectUser = async (id) => {
  const user = await apiRequest(`/auth/admin/users/${id}/reject/`, { method: 'POST' })
  return normalizeUser(user)
}

export const requestInfo = async (id, message) => ({ id, message, sentAt: new Date().toISOString() })

export const getCategories = () => apiRequest('/catalog/categories/')

export const addCategory = (name) => apiRequest('/catalog/categories/', { method: 'POST', body: { name } })

export const updateCategory = (id, name) =>
  apiRequest(`/catalog/categories/${id}/`, { method: 'PATCH', body: { name } })

export const deleteCategory = async (id) => {
  await apiRequest(`/catalog/categories/${id}/`, { method: 'DELETE' })
  return true
}

export const getOfficialPrices = async () => {
  const prices = await apiRequest('/catalog/official-prices/')
  return prices.map((item) => ({
    categoryId: item.category,
    min: Number(item.minimum),
    max: Number(item.maximum),
    suggested: Number(item.suggested),
  }))
}

export const setOfficialPrice = async (categoryId, price) => {
  const all = await apiRequest('/catalog/official-prices/')
  const existing = all.find((item) => item.category === categoryId)

  if (existing) {
    return apiRequest(`/catalog/official-prices/${existing.id}/`, {
      method: 'PATCH',
      body: {
        minimum: Number(price.min),
        maximum: Number(price.max),
        suggested: Number(price.suggested),
      },
    })
  }

  return apiRequest('/catalog/official-prices/', {
    method: 'POST',
    body: {
      category: categoryId,
      minimum: Number(price.min),
      maximum: Number(price.max),
      suggested: Number(price.suggested),
    },
  })
}

export const generateReport = ({ region, category, fromDate, toDate }) => {
  const search = new URLSearchParams()
  if (region) search.set('region', region)
  if (category) search.set('category', category)
  if (fromDate) search.set('fromDate', fromDate)
  if (toDate) search.set('toDate', toDate)
  const query = search.toString()

  return apiRequest(`/auth/admin/reports/${query ? `?${query}` : ''}`)
}
