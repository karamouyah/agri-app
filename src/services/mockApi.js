// File responsibility: Centralizes browser-to-backend API calls and response shaping for the frontend.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { apiRequest } from './apiClient'
import controlledCatalog from '../../shared/controlled-product-catalog.json'
import { PLATFORM_CURRENCY } from '../utils/currency'

// normalizeProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
const normalizeProduct = (item) => ({
  id: item.id,
  productId: item.product,
  name: item.name,
  category: item.category_name,
  unit: item.unit || 'kg',
  minPrice: Number(item.min_price_dzd ?? item.min_price ?? 0),
  maxPrice: Number(item.max_price_dzd ?? item.max_price ?? 0),
  price: Number(item.price),
  quantity: item.quantity_available,
  description: item.description || '',
  imageUrl: item.image_url || '',
  status: item.status,
  isActive: item.is_active ?? true,
  currency: item.currency || PLATFORM_CURRENCY,
})

// normalizeControlledProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
const normalizeControlledProduct = (item, fallbackId) => ({
  id: Number(item.id ?? fallbackId),
  name: item.name,
  category: item.category,
  unit: item.unit || 'kg',
  minPrice: Number(item.min_price_dzd ?? item.min_price ?? 0),
  maxPrice: Number(item.max_price_dzd ?? item.max_price ?? 0),
  isActive: item.is_active ?? true,
  currency: item.currency || PLATFORM_CURRENCY,
})

const fallbackControlledProducts = controlledCatalog.map((item, index) =>
  normalizeControlledProduct(
    {
      ...item,
      id: index + 1,
      currency: PLATFORM_CURRENCY,
    },
    index + 1,
  ),
)

// mapOrderForFarmer handles this module workflow, using its parameters and returning JSX, data, or a service result.
const mapOrderForFarmer = (order) => ({
  id: order.id,
  buyerName: 'Buyer',
  product: order.items[0]?.name || '-',
  quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
  orderDate: order.created_at.slice(0, 10),
  status: order.status,
  amount: Number(order.total),
  currency: order.currency || PLATFORM_CURRENCY,
  deliveryAddress: order.address,
})

// getControlledProducts handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getControlledProducts = async (filters = {}) => {
  const search = new URLSearchParams()
  if (filters.query) search.set('q', filters.query)
  if (filters.category && filters.category !== 'All') search.set('category', filters.category)

  try {
    const products = await apiRequest(`/catalog/predefined-products/${search.toString() ? `?${search}` : ''}`)
    return products.map((item, index) => normalizeControlledProduct(item, index + 1))
  } catch (_error) {
    return fallbackControlledProducts.filter((item) => {
      const matchesCategory =
        !filters.category || filters.category === 'All' || item.category === filters.category
      const normalizedQuery = (filters.query || '').trim().toLowerCase()
      const matchesQuery = !normalizedQuery || item.name.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }
}

// getFarmProfile handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getFarmProfile = () => apiRequest('/auth/farmer/profile/')

// updateFarmProfile handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const updateFarmProfile = (data) =>
  apiRequest('/auth/farmer/profile/', {
    method: 'PATCH',
    body: data,
  })

// getProducts handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getProducts = async () => {
  const products = await apiRequest('/catalog/products/')
  return products.map(normalizeProduct)
}

// addProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const addProduct = async (product) => {
  const created = await apiRequest('/catalog/products/', {
    method: 'POST',
    body: {
      product: Number(product.productId),
      price: Number(product.price),
      quantity_available: Number(product.quantity),
    },
  })
  return normalizeProduct(created)
}

// updateProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const updateProduct = async (product) => {
  const updated = await apiRequest(`/catalog/products/${product.id}/`, {
    method: 'PATCH',
    body: {
      product: Number(product.productId),
      price: Number(product.price),
      quantity_available: Number(product.quantity),
    },
  })
  return normalizeProduct(updated)
}

// deleteProduct handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const deleteProduct = async (id) => {
  await apiRequest(`/catalog/products/${id}/`, { method: 'DELETE' })
  return true
}

// getOrders handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getOrders = async () => {
  const orders = await apiRequest('/orders/mine/')
  return orders.map(mapOrderForFarmer)
}

// updateOrderStatus handles this module workflow, using its parameters and returning JSX, data, or a service result.
const updateOrderStatus = async (id, nextStatus) => {
  const updated = await apiRequest(`/orders/${id}/status/`, {
    method: 'PATCH',
    body: { status: nextStatus },
  })
  return mapOrderForFarmer(updated)
}

// acceptOrder handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const acceptOrder = async (id) => updateOrderStatus(id, 'accepted')

// declineOrder handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const declineOrder = async (id) => updateOrderStatus(id, 'declined')

// getRevenueData handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getRevenueData = async () => {
  const orders = await apiRequest('/orders/mine/')
  const transactions = orders.map((order) => ({
    id: order.id,
    product: order.items[0]?.name || '-',
    amount: Number(order.total),
    currency: order.currency || PLATFORM_CURRENCY,
    date: order.created_at.slice(0, 10),
  }))

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return {
    total,
    series: transactions.slice(0, 4).map((tx, index) => ({ period: `Week ${index + 1}`, amount: tx.amount })),
    transactions,
  }
}
