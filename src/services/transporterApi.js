import { apiRequest } from './apiClient'

const normalizeMission = (mission) => ({
  id: mission.id,
  orderId: mission.order_id,
  pickupLocation: mission.pickup_location,
  deliveryLocation: mission.delivery_location,
  pickupWilayaId: Number(mission.pickup_wilaya_id || 0) || '',
  pickupWilayaName: mission.pickup_wilaya_name || '',
  pickupCommuneId: Number(mission.pickup_commune_id || 0) || '',
  pickupCommuneName: mission.pickup_commune_name || '',
  deliveryWilayaId: Number(mission.delivery_wilaya_id || 0) || '',
  deliveryWilayaName: mission.delivery_wilaya_name || '',
  deliveryCommuneId: Number(mission.delivery_commune_id || 0) || '',
  deliveryCommuneName: mission.delivery_commune_name || '',
  deadline: mission.deadline,
  loadKg: Number(mission.load_kg || 0),
  buyerContact: mission.buyer_contact,
  farmerContact: mission.farmer_contact,
  status: mission.status,
})

export const getTransporterProfile = async () => {
  const profile = await apiRequest('/auth/transporter/profile/')
  return {
    phoneNumber: profile.phone_number || profile.phone || '',
    vehicle: profile.vehicle || '',
    maxLoadKg: Number(profile.max_load_kg || 0) || '',
    capacity: Number(profile.capacity || 0) || '',
    serviceArea: profile.service_area || '',
    deliveryWilayaIds: profile.delivery_wilaya_ids || profile.deliveryWilayaIds || [],
    deliveryWilayas: profile.delivery_wilayas || [],
  }
}

export const updateTransporterProfile = async (profile) => {
  const payload = await apiRequest('/auth/transporter/profile/', {
    method: 'PATCH',
    body: {
      vehicle: profile.vehicle,
      max_load_kg: Number(profile.maxLoadKg),
      phone_number: profile.phoneNumber,
      delivery_wilaya_ids: profile.deliveryWilayaIds,
    },
  })

  return {
    phoneNumber: payload.phone_number || payload.phone || '',
    vehicle: payload.vehicle || '',
    maxLoadKg: Number(payload.max_load_kg || 0) || '',
    capacity: Number(payload.capacity || 0) || '',
    serviceArea: payload.service_area || '',
    deliveryWilayaIds: payload.delivery_wilaya_ids || payload.deliveryWilayaIds || [],
    deliveryWilayas: payload.delivery_wilayas || [],
  }
}

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
