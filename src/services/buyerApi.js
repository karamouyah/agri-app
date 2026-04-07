import { apiRequest } from './apiClient'
import { PLATFORM_CURRENCY } from '../utils/currency'

const KEYS = {
  cart: 'agri_buyer_cart',
  shipping: 'agri_buyer_shipping',
}

const fromStorage = (key, fallback) => {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

const toStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const buyerFilterOptions = {
  categories: [],
  locations: [],
  wilayas: [],
  communes: [],
  qualities: ['A', 'B', 'Premium'],
}

apiRequest('/catalog/filters/')
  .then((payload) => {
    buyerFilterOptions.categories = payload.categories || []
    buyerFilterOptions.locations = payload.locations || []
    buyerFilterOptions.wilayas = payload.wilayas || []
    buyerFilterOptions.communes = payload.communes || []
    buyerFilterOptions.qualities = payload.qualities || buyerFilterOptions.qualities
  })
  .catch(() => {
    // Keep defaults when backend is unavailable during initial load.
  })

const normalizeProduct = (item) => ({
  id: item.id,
  name: item.name,
  category: item.category_name,
  unit: item.unit || 'kg',
  price: Number(item.price),
  minPrice: Number(item.min_price_dzd ?? item.min_price ?? 0),
  maxPrice: Number(item.max_price_dzd ?? item.max_price ?? 0),
  currency: item.currency || PLATFORM_CURRENCY,
  quantityAvailable: item.quantity_available,
  farmerName: item.farmer_name,
  farmerRegion: item.farmer_region,
  farmerWilayaId: Number(item.farmer_wilaya_id || 0) || '',
  farmerWilaya: item.farmer_wilaya || '',
  farmerCommuneId: Number(item.farmer_commune_id || 0) || '',
  farmerCommune: item.farmer_commune || '',
  quality: item.quality,
  imageUrl: item.image_url || '',
  description: item.description || '',
  status: item.status,
})

const toTimeline = (status) => {
  const steps = ['Order placed', 'Accepted by farmer', 'In transit', 'Delivered']
  const doneMap = {
    pending: 1,
    accepted: 2,
    shipped: 2,
    'in transit': 3,
    delivered: 4,
    declined: 1,
  }
  const doneCount = doneMap[status] || 1
  return steps.map((label, index) => ({ label, done: index < doneCount }))
}

const normalizeOrder = (order) => ({
  id: order.id,
  date: order.created_at.slice(0, 10),
  total: Number(order.total),
  currency: order.currency || PLATFORM_CURRENCY,
  status: order.status,
  estimatedDelivery: order.estimated_delivery,
  paymentMethod: order.payment_method,
  address: order.address,
  deliveryWilayaId: Number(order.delivery_wilaya_id || 0) || '',
  deliveryWilayaName: order.delivery_wilaya_name || '',
  deliveryCommuneId: Number(order.delivery_commune_id || 0) || '',
  deliveryCommuneName: order.delivery_commune_name || '',
  pickupWilayaId: Number(order.pickup_wilaya_id || 0) || '',
  pickupWilayaName: order.pickup_wilaya_name || '',
  pickupCommuneId: Number(order.pickup_commune_id || 0) || '',
  pickupCommuneName: order.pickup_commune_name || '',
  items: order.items.map((item) => ({
    productId: item.product_id,
    name: item.name,
    quantity: item.quantity,
    unitPrice: Number(item.unit_price),
    currency: item.currency || PLATFORM_CURRENCY,
  })),
  timeline: toTimeline(order.status),
})

export const searchProducts = async (query = '', filters = {}, page = 1, pageSize = 6) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (filters.category) params.set('category', filters.category)
  if (filters.location) params.set('location', filters.location)
  if (filters.wilaya) params.set('wilaya', filters.wilaya)
  if (filters.commune) params.set('commune', filters.commune)
  if (filters.quality) params.set('quality', filters.quality)

  const products = await apiRequest(`/catalog/products/${params.toString() ? `?${params.toString()}` : ''}`)
  const normalized = products.map(normalizeProduct)
  const min = Number(filters.minPrice || 0)
  const max = Number(filters.maxPrice || Number.MAX_SAFE_INTEGER)
  const filtered = normalized.filter((item) => item.price >= min && item.price <= max)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const normalizedPage = Math.min(Math.max(1, page), totalPages)
  const start = (normalizedPage - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page: normalizedPage,
    pageSize,
    totalPages,
  }
}

export const getProductById = async (id) => {
  const item = await apiRequest(`/catalog/products/${id}/`)
  return normalizeProduct(item)
}

export const getRelatedProducts = async (id) => {
  const related = await apiRequest(`/catalog/products/${id}/related/`)
  return related.map(normalizeProduct)
}

export const getCart = async () => fromStorage(KEYS.cart, [])

export const addToCart = async (product, quantity) => {
  const cart = fromStorage(KEYS.cart, [])
  const qty = Number(quantity)

  if (cart.length > 0) {
    const cartFarmer = cart[0].farmerName
    const incomingFarmer = product.farmerName
    if (cartFarmer && incomingFarmer && cartFarmer !== incomingFarmer) {
      throw new Error('You can only checkout products from one farmer at a time. Please clear cart first.')
    }
  }

  const existing = cart.find((item) => item.productId === product.id)

  if (existing) {
    existing.quantity += qty
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      unitPrice: Number(product.price),
      currency: product.currency || PLATFORM_CURRENCY,
      quantity: qty,
      farmerName: product.farmerName,
    })
  }

  toStorage(KEYS.cart, cart)
  return cart
}

export const updateCartQuantity = async (productId, quantity) => {
  const cart = fromStorage(KEYS.cart, [])
  const qty = Number(quantity)
  const updated = cart
    .map((item) => (item.productId === productId ? { ...item, quantity: qty } : item))
    .filter((item) => item.quantity > 0)
  toStorage(KEYS.cart, updated)
  return updated
}

export const removeCartItem = async (productId) => {
  const updated = fromStorage(KEYS.cart, []).filter((item) => item.productId !== productId)
  toStorage(KEYS.cart, updated)
  return updated
}

export const clearCart = async () => {
  toStorage(KEYS.cart, [])
  return true
}

export const calculateCartTotals = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const taxes = Math.round(subtotal * 0.1)
  const total = subtotal + taxes
  return { subtotal, taxes, total, currency: PLATFORM_CURRENCY }
}

export const getShippingProfile = async () => {
  try {
    const profile = await apiRequest('/auth/buyer/profile/')
    const shippingProfile = {
      fullName: '',
      phone: profile.phone_number || profile.phone || '',
      address: profile.street_address || '',
      city: profile.commune_name || '',
      postalCode: '',
      wilayaId: Number(profile.wilaya_id || profile.wilayaId || 0) || '',
      communeId: Number(profile.commune_id || profile.communeId || 0) || '',
    }
    toStorage(KEYS.shipping, shippingProfile)
    return shippingProfile
  } catch (_error) {
    return fromStorage(KEYS.shipping, {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      wilayaId: '',
      communeId: '',
    })
  }
}

export const getBuyerProfile = async () => {
  const profile = await apiRequest('/auth/buyer/profile/')
  return {
    address: profile.address || '',
    streetAddress: profile.street_address || '',
    phoneNumber: profile.phone_number || profile.phone || '',
    wilayaId: Number(profile.wilaya_id || profile.wilayaId || 0) || '',
    wilayaName: profile.wilaya_name || '',
    communeId: Number(profile.commune_id || profile.communeId || 0) || '',
    communeName: profile.commune_name || '',
    locationLabel: profile.location_label || '',
  }
}

export const updateBuyerProfile = async (profile) => {
  const payload = await apiRequest('/auth/buyer/profile/', {
    method: 'PATCH',
    body: {
      address: profile.address,
      phone_number: profile.phoneNumber,
      wilaya_id: Number(profile.wilayaId),
      commune_id: Number(profile.communeId),
    },
  })

  const shippingProfile = {
    fullName: profile.fullName || '',
    phone: payload.phone_number || profile.phoneNumber || '',
    address: payload.street_address || profile.address || '',
    city: payload.commune_name || '',
    postalCode: profile.postalCode || '',
    wilayaId: Number(payload.wilaya_id || payload.wilayaId || 0) || '',
    communeId: Number(payload.commune_id || payload.communeId || 0) || '',
  }
  toStorage(KEYS.shipping, shippingProfile)

  return {
    address: payload.address || '',
    streetAddress: payload.street_address || '',
    phoneNumber: payload.phone_number || '',
    wilayaId: Number(payload.wilaya_id || payload.wilayaId || 0) || '',
    wilayaName: payload.wilaya_name || '',
    communeId: Number(payload.commune_id || payload.communeId || 0) || '',
    communeName: payload.commune_name || '',
    locationLabel: payload.location_label || '',
  }
}

export const placeOrder = async (cartItems, address, paymentMethod) => {
  const farmerNames = [...new Set(cartItems.map((item) => item.farmerName).filter(Boolean))]
  if (farmerNames.length > 1) {
    throw new Error('Your cart contains products from different farmers. Please place separate orders.')
  }

  const order = await apiRequest('/orders/checkout/', {
    method: 'POST',
    body: {
      items: cartItems.map((item) => ({ product_id: item.productId, quantity: Number(item.quantity) })),
      address: address.address,
      wilaya_id: Number(address.wilayaId),
      commune_id: Number(address.communeId),
      payment_method: paymentMethod,
    },
  })

  toStorage(KEYS.shipping, address)
  toStorage(KEYS.cart, [])
  return normalizeOrder(order)
}

export const getBuyerOrders = async () => {
  const orders = await apiRequest('/orders/mine/')
  return orders.map(normalizeOrder)
}

export const getBuyerOrderById = async (orderId) => {
  const orders = await getBuyerOrders()
  return orders.find((order) => order.id === orderId) || null
}

export const getInvoices = async () => {
  const invoices = await apiRequest('/orders/invoices/mine/')
  return invoices.map((item) => ({
    id: item.id,
    orderId: item.order_id,
    date: item.date.slice(0, 10),
    amount: Number(item.amount),
    currency: item.currency || PLATFORM_CURRENCY,
    downloadUrl: '#',
    details: item.details,
  }))
}

export const getInvoiceById = async (invoiceId) => {
  const invoices = await getInvoices()
  return invoices.find((invoice) => invoice.id === invoiceId) || null
}
