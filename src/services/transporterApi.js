// File responsibility: Centralizes browser-to-backend API calls and response shaping for the frontend.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { apiRequest } from './apiClient'

// normalizeMission handles this module workflow, using its parameters and returning JSX, data, or a service result.
const normalizeMission = (mission) => ({
  id: mission.id,
  trackingNumber: mission.tracking_number || '',
  orderId: mission.order_id,
  orderDate: mission.order_date || '',
  deliveryRequestDate: mission.delivery_request_date || '',
  pickupLocation: mission.pickup_location || '',
  deliveryLocation: mission.delivery_location || '',
  pickupAddress: mission.pickup_address || '',
  deliveryAddress: mission.delivery_address || '',
  pickupWilayaId: Number(mission.pickup_wilaya_id || 0) || '',
  pickupWilayaName: mission.pickup_wilaya_name || '',
  pickupCommuneId: Number(mission.pickup_commune_id || 0) || '',
  pickupCommuneName: mission.pickup_commune_name || '',
  deliveryWilayaId: Number(mission.delivery_wilaya_id || 0) || '',
  deliveryWilayaName: mission.delivery_wilaya_name || '',
  deliveryCommuneId: Number(mission.delivery_commune_id || 0) || '',
  deliveryCommuneName: mission.delivery_commune_name || '',
  deadline: mission.deadline || '',
  loadKg: Number(mission.load_kg || 0),
  shippingFee: Number(mission.shipping_fee || 0),
  totalAmount: Number(mission.total_amount || 0),
  completedAt: mission.completed_at || '',
  buyerName: mission.buyer_name || '',
  farmerName: mission.farmer_name || '',
  buyerContact: mission.buyer_contact || '',
  farmerContact: mission.farmer_contact || '',
  status: mission.status || 'pending',
  orderStatus: mission.order_status || '',
  paymentMethod: mission.payment_method || '',
  items: Array.isArray(mission.items)
    ? mission.items.map((item) => ({
        name: item.name || 'Product',
        quantity: Number(item.quantity || 0),
        unit: item.unit || 'kg',
        unitPrice: Number(item.unit_price || 0),
        total: Number(item.total || 0),
      }))
    : [],
})

// getTransporterProfile handles this module workflow, using its parameters and returning JSX, data, or a service result.
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

// updateTransporterProfile handles this module workflow, using its parameters and returning JSX, data, or a service result.
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

// getDeliveryRequests handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getDeliveryRequests = async () => {
  const data = await apiRequest('/logistics/requests/')
  return data.map(normalizeMission)
}

// getActiveDeliveries handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getActiveDeliveries = async () => {
  const data = await apiRequest('/logistics/active/')
  return data.map(normalizeMission)
}

// getCompletedDeliveries returns missions already delivered by the signed-in transporter.
export const getCompletedDeliveries = async () => {
  const data = await apiRequest('/logistics/completed/')
  return data.map(normalizeMission)
}

// getDeclinedDeliveries returns missions declined or cancelled for the signed-in transporter.
export const getDeclinedDeliveries = async () => {
  const data = await apiRequest('/logistics/declined/')
  return data.map(normalizeMission)
}

// getDeliveryById handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getDeliveryById = async (id) => {
  const data = await apiRequest(`/logistics/missions/${id}/`)
  return normalizeMission(data)
}

// acceptMission handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const acceptMission = async (id) => {
  const data = await apiRequest(`/logistics/missions/${id}/accept/`, { method: 'POST' })
  return normalizeMission(data)
}

// declineMission handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const declineMission = async (id) => {
  const data = await apiRequest(`/logistics/missions/${id}/decline/`, { method: 'POST' })
  return normalizeMission(data)
}

// updateDeliveryStatus handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const updateDeliveryStatus = async (id, newStatus) => {
  const data = await apiRequest(`/logistics/missions/${id}/status/`, {
    method: 'PATCH',
    body: { status: newStatus },
  })
  return normalizeMission(data)
}
