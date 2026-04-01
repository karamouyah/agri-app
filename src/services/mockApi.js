import { apiRequest } from './apiClient'

const normalizeProduct = (item) => ({
  id: item.id,
  name: item.name,
  category: item.category_name,
  price: Number(item.price),
  quantity: item.quantity_available,
  description: item.description || '',
  imageUrl: item.image_url || '',
  status: item.status,
})

const mapOrderForFarmer = (order) => ({
  id: order.id,
  buyerName: 'Buyer',
  product: order.items[0]?.name || '-',
  quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
  orderDate: order.created_at.slice(0, 10),
  status: order.status,
  amount: Number(order.total),
  deliveryAddress: order.address,
})

const getCategoryIdByName = async (name) => {
  const categories = await apiRequest('/catalog/categories/')
  const found = categories.find((item) => item.name === name)
  if (!found) {
    throw new Error('Category not found. Please create it first.')
  }
  return found.id
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
  const categoryId = await getCategoryIdByName(product.category)
  const created = await apiRequest('/catalog/products/', {
    method: 'POST',
    body: {
      name: product.name,
      category: categoryId,
      price: Number(product.price),
      quantity_available: Number(product.quantity),
      farmer_region: 'Meknes',
      quality: 'A',
      image_url: product.imageUrl || '',
      description: product.description,
    },
  })
  return normalizeProduct(created)
}

export const updateProduct = async (product) => {
  const categoryId = await getCategoryIdByName(product.category)
  const updated = await apiRequest(`/catalog/products/${product.id}/`, {
    method: 'PATCH',
    body: {
      name: product.name,
      category: categoryId,
      price: Number(product.price),
      quantity_available: Number(product.quantity),
      image_url: product.imageUrl || '',
      description: product.description,
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
    date: order.created_at.slice(0, 10),
  }))

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return {
    total,
    series: transactions.slice(0, 4).map((tx, index) => ({ period: `Week ${index + 1}`, amount: tx.amount })),
    transactions,
  }
}
