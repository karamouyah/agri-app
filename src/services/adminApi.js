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

const normalizeAdminProduct = (item) => ({
  id: item.id,
  name: item.name,
  categoryId: Number(item.category),
  categoryName: item.category_name || '',
  minPrice: Number(item.min_price_dzd ?? 0),
  maxPrice: Number(item.max_price_dzd ?? 0),
  suggestedPrice:
    item.suggested_price_dzd === null || item.suggested_price_dzd === undefined
      ? null
      : Number(item.suggested_price_dzd),
})

const buildProductPayload = (product) => ({
  name: product.name.trim(),
  category: Number(product.categoryId),
  min_price_dzd: Number(product.minPrice),
  max_price_dzd: Number(product.maxPrice),
  suggested_price_dzd:
    product.suggestedPrice === '' || product.suggestedPrice === null || product.suggestedPrice === undefined
      ? null
      : Number(product.suggestedPrice),
})

export const getProducts = async () => {
  const products = await apiRequest('/products/')
  return products.map(normalizeAdminProduct)
}

export const addProduct = async (product) => {
  const created = await apiRequest('/products/', {
    method: 'POST',
    body: buildProductPayload(product),
  })
  return normalizeAdminProduct(created)
}

export const updateProduct = async (id, product) => {
  const updated = await apiRequest(`/products/${id}/`, {
    method: 'PUT',
    body: buildProductPayload(product),
  })
  return normalizeAdminProduct(updated)
}

export const deleteProduct = async (id) => {
  await apiRequest(`/products/${id}/`, { method: 'DELETE' })
  return true
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
