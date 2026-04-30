// File responsibility: Centralizes browser-to-backend API calls and response shaping for the frontend.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { apiRequest } from './apiClient'

// normalizeUser handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  verificationDocumentsCount: Number(user.verification_documents_count || 0),
  verificationDocumentsStatus: user.verification_documents_status || 'not_required',
})

// getNationalStats handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getNationalStats = () => apiRequest('/auth/admin/stats/')

// getUsers handles this Imodule workflow, using its parameters and returning JSX, data, or a service result.
export const getUsers = async (filters = {}) => {
  const search = new URLSearchParams()
  if (filters.role) search.set('role', filters.role)
  if (filters.approvalStatus) search.set('approval_status', filters.approvalStatus)
  if (filters.wilaya) search.set('wilaya', filters.wilaya)
  const query = search.toString()
  const users = await apiRequest(`/auth/admin/users/${query ? `?${query}` : ''}`)
  return users.map(normalizeUser)
}

// getPendingUsers handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getPendingUsers = async () => {
  const users = await apiRequest('/auth/admin/users/pending/')
  return users.map(normalizeUser)
}

// approveUser handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const approveUser = async (id) => {
  const user = await apiRequest(`/auth/admin/users/${id}/approve/`, { method: 'POST' })
  return normalizeUser(user)
}

// rejectUser handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const rejectUser = async (id) => {
  const user = await apiRequest(`/auth/admin/users/${id}/reject/`, { method: 'POST' })
  return normalizeUser(user)
}

// requestInfo handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const requestInfo = async (id, message) => ({ id, message, sentAt: new Date().toISOString() })

const normalizePerson = (person) => ({
  id: person?.id ?? null,
  name: person?.name || '',
  email: person?.email || '',
  phoneNumber: person?.phone_number || '',
})

const normalizeLocation = (location) => ({
  address: location?.address || '',
  wilaya: location?.wilaya || '',
  commune: location?.commune || '',
  label: location?.label || '',
})

const normalizeAdminOrder = (order) => ({
  id: order?.order_id ?? order?.id ?? null,
  items: Array.isArray(order?.items)
    ? order.items.map((item) => ({
        productId: item?.product_id ?? null,
        name: item?.name || '',
        category: item?.category || '',
        unit: item?.unit || '',
        quantity: Number(item?.quantity || 0),
        unitPrice: Number(item?.unit_price || 0),
        total: Number(item?.total || 0),
      }))
    : [],
  buyer: normalizePerson(order?.buyer),
  farmer: normalizePerson(order?.farmer),
  transporter: order?.transporter ? normalizePerson(order.transporter) : null,
  totalAmount: Number(order?.total_amount || 0),
  currency: order?.currency || 'DZD',
  payment: order?.payment
    ? {
        id: order.payment.id ?? null,
        amount: Number(order.payment.amount || 0),
        method: order.payment.method || '',
        transactionDate: order.payment.transaction_date || '',
        status: order.payment.status || '',
      }
    : null,
  shipment: order?.shipment
    ? {
        id: order.shipment.id ?? null,
        trackingNumber: order.shipment.tracking_number || '',
        status: order.shipment.status || '',
        shippingFee: Number(order.shipment.shipping_fee || 0),
        pickupDate: order.shipment.pickup_date || '',
        estimatedDeliveryDate: order.shipment.estimated_delivery_date || '',
        actualDeliveryDate: order.shipment.actual_delivery_date || '',
      }
    : null,
  pickupLocation: normalizeLocation(order?.pickup_location),
  deliveryLocation: normalizeLocation(order?.delivery_location),
  orderStatus: order?.order_status || '',
  createdAt: order?.created_at || '',
  updatedAt: order?.updated_at || '',
})

// getAdminOrders returns Ministry-visible orders with order, payment, and shipment fields only.
export const getAdminOrders = async () => {
  const orders = await apiRequest('/orders/admin/')
  return Array.isArray(orders) ? orders.map(normalizeAdminOrder) : []
}

// getCategories handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getCategories = () => apiRequest('/catalog/categories/')

// addCategory handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const addCategory = (name) => apiRequest('/catalog/categories/', { method: 'POST', body: { name } })

// updateCategory handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const updateCategory = (id, name) =>
  apiRequest(`/catalog/categories/${id}/`, { method: 'PATCH', body: { name } })

// deleteCategory handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const deleteCategory = async (id) => {
  await apiRequest(`/catalog/categories/${id}/`, { method: 'DELETE' })
  return true
}

// normalizeAdminProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  imageUrl: item.image_url || '',
})

// buildProductPayload handles this module workflow, using its parameters and returning JSX, data, or a service result.
const buildProductPayload = (product) => {
  const payload = {
    name: product.name.trim(),
    category: Number(product.categoryId),
    min_price_dzd: Number(product.minPrice),
    max_price_dzd: Number(product.maxPrice),
    suggested_price_dzd:
      product.suggestedPrice === '' || product.suggestedPrice === null || product.suggestedPrice === undefined
        ? null
        : Number(product.suggestedPrice),
  }

  if (product.imageDataUrl) {
    payload.image_data_url = product.imageDataUrl
  }

  return payload
}

// getProducts handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getProducts = async () => {
  const products = await apiRequest('/products/')
  return products.map(normalizeAdminProduct)
}

// addProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const addProduct = async (product) => {
  const created = await apiRequest('/products/', {
    method: 'POST',
    body: buildProductPayload(product),
  })
  return normalizeAdminProduct(created)
}

// updateProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const updateProduct = async (id, product) => {
  const updated = await apiRequest(`/products/${id}/`, {
    method: 'PUT',
    body: buildProductPayload(product),
  })
  return normalizeAdminProduct(updated)
}

// deleteProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const deleteProduct = async (id) => {
  await apiRequest(`/products/${id}/`, { method: 'DELETE' })
  return true
}

// generateReport handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const generateReport = ({ region, category, fromDate, toDate }) => {
  const search = new URLSearchParams()
  if (region) search.set('region', region)
  if (category) search.set('category', category)
  if (fromDate) search.set('fromDate', fromDate)
  if (toDate) search.set('toDate', toDate)
  const query = search.toString()

  return apiRequest(`/auth/admin/reports/${query ? `?${query}` : ''}`)
}
