// File responsibility: Centralizes browser-to-backend API calls and response shaping for the frontend.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import fallbackDataset from '../../shared/algeria-locations.json'
import { apiRequest } from './apiClient'

// normalizeWilaya handles this module workflow, using its parameters and returning JSX, data, or a service result.
const normalizeWilaya = (wilaya) => ({
  id: Number(wilaya.id),
  code: String(wilaya.code).padStart(2, '0'),
  name: wilaya.name,
  communes: (wilaya.communes || []).map((commune) => ({
    id: Number(commune.id),
    name: commune.name,
    wilayaId: Number(commune.wilaya ?? wilaya.id),
  })),
})

// normalizeDataset handles this module workflow, using its parameters and returning JSX, data, or a service result.
const normalizeDataset = (payload) => (payload?.wilayas || payload || []).map(normalizeWilaya)

export const fallbackLocations = normalizeDataset(fallbackDataset)

// getLocationTree handles this module workflow, using its parameters and returning JSX, data, or a service result.
export async function getLocationTree() {
  try {
    const payload = await apiRequest('/locations/tree/')
    return normalizeDataset(payload)
  } catch (_error) {
    return fallbackLocations
  }
}
