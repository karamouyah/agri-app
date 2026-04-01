import { apiRequest } from './apiClient'

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
  qualities: ['A', 'B', 'Premium'],
}

apiRequest('/catalog/filters/')
  .then((payload) => {
    buyerFilterOptions.categories = payload.categories || []
    buyerFilterOptions.locations = payload.locations || []
    buyerFilterOptions.qualities = payload.qualities || buyerFilterOptions.qualities
  })
  .catch(() => {
    // Keep defaults when backend is unavailable during initial load.
  })

const normalizeProduct = (item) => ({
  id: item.id,
  name: item.name,
  category: item.category_name,
  price: Number(item.price),
  quantityAvailable: item.quantity_available,
  farmerName: item.farmer_name,
  farmerRegion: item.farmer_region,
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
  status: order.status,
  estimatedDelivery: order.estimated_delivery,
  paymentMethod: order.payment_method,
  address: order.address,
  items: order.items.map((item) => ({
    productId: item.product_id,
    name: item.name,
    quantity: item.quantity,
    unitPrice: Number(item.unit_price),
  })),
  timeline: toTimeline(order.status),
})

export const searchProducts = async (query = '', filters = {}, page = 1, pageSize = 6) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (filters.category) params.set('category', filters.category)
  if (filters.location) params.set('location', filters.location)
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
  const taxes = Number((subtotal * 0.1).toFixed(2))
  const total = Number((subtotal + taxes).toFixed(2))
  return { subtotal, taxes, total }
}

export const getShippingProfile = async () =>
  fromStorage(KEYS.shipping, {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })

export const placeOrder = async (cartItems, address, paymentMethod) => {
  const farmerNames = [...new Set(cartItems.map((item) => item.farmerName).filter(Boolean))]
  if (farmerNames.length > 1) {
    throw new Error('Your cart contains products from different farmers. Please place separate orders.')
  }

  const order = await apiRequest('/orders/checkout/', {
    method: 'POST',
    body: {
      items: cartItems.map((item) => ({ product_id: item.productId, quantity: Number(item.quantity) })),
      address: `${address.address}, ${address.city} ${address.postalCode}`,
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
    downloadUrl: '#',
    details: item.details,
  }))
}

export const getInvoiceById = async (invoiceId) => {
  const invoices = await getInvoices()
  return invoices.find((invoice) => invoice.id === invoiceId) || null
}
