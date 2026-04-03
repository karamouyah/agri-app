import { apiRequest } from './apiClient'
import controlledCatalog from '../../shared/controlled-product-catalog.json'
import { PLATFORM_CURRENCY } from '../utils/currency'

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

export const getFarmProfile = () => apiRequest('/auth/farmer/profile/')

export const updateFarmProfile = (data) =>
  apiRequest('/auth/farmer/profile/', {
    method: 'PATCH',
    body: data,
  })

export const getProducts = async () => {
  const products = await apiRequest('/catalog/products/')
  return products.map(normalizeProduct)
}

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

export const deleteProduct = async (id) => {
  await apiRequest(`/catalog/products/${id}/`, { method: 'DELETE' })
  return true
}

export const getOrders = async () => {
  const orders = await apiRequest('/orders/mine/')
  return orders.map(mapOrderForFarmer)
}

const updateOrderStatus = async (id, nextStatus) => {
  const updated = await apiRequest(`/orders/${id}/status/`, {
    method: 'PATCH',
    body: { status: nextStatus },
  })
  return mapOrderForFarmer(updated)
}

export const acceptOrder = async (id) => updateOrderStatus(id, 'accepted')

export const declineOrder = async (id) => updateOrderStatus(id, 'declined')

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
