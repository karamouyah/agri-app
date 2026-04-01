import { apiRequest } from './apiClient'

const normalizeMission = (mission) => ({
  id: mission.id,
  orderId: mission.order_id,
  pickupLocation: mission.pickup_location,
  deliveryLocation: mission.delivery_location,
  deadline: mission.deadline,
  buyerContact: mission.buyer_contact,
  farmerContact: mission.farmer_contact,
  status: mission.status,
})

export const getDeliveryRequests = async () => {
  const data = await apiRequest('/logistics/requests/')
  return data.map(normalizeMission)
}

export const getActiveDeliveries = async () => {
  const data = await apiRequest('/logistics/active/')
  return data.map(normalizeMission)
}

export const getDeliveryById = async (id) => {
  const data = await apiRequest(`/logistics/missions/${id}/`)
  return normalizeMission(data)
}

export const acceptMission = async (id) => {
  const data = await apiRequest(`/logistics/missions/${id}/accept/`, { method: 'POST' })
  return normalizeMission(data)
}

export const declineMission = async (id) => {
  const data = await apiRequest(`/logistics/missions/${id}/decline/`, { method: 'POST' })
  return normalizeMission(data)
}

export const updateDeliveryStatus = async (id, newStatus) => {
  const data = await apiRequest(`/logistics/missions/${id}/status/`, {
    method: 'PATCH',
    body: { status: newStatus },
  })
  return normalizeMission(data)
}
