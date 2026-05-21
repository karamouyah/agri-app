// File responsibility: Centralizes browser-to-backend API calls and response shaping for the frontend.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import fallbackDataset from '../../shared/algeria-locations.json'
import { apiRequest } from './apiClient'

const WILAYA_NAMES_BY_CODE = {
  '06': 'Bejaia',
  '08': 'Bechar',
  '12': 'Tebessa',
  '19': 'Setif',
  '20': 'Saida',
  '22': 'Sidi Bel Abbes',
  '26': 'Medea',
  '35': 'Boumerdes',
  '44': 'Ain Defla',
  '45': 'Naama',
  '46': 'Ain Temouchent',
  '47': 'Ghardaia',
  '52': 'Beni Abbes',
}

// normalizeWilaya handles this module workflow, using its parameters and returning JSX, data, or a service result.
const normalizeWilaya = (wilaya) => {
  const code = String(wilaya.code).padStart(2, '0')

  return {
    id: Number(wilaya.id),
    code,
    name: WILAYA_NAMES_BY_CODE[code] || wilaya.name,
    communes: (wilaya.communes || []).map((commune) => ({
      id: Number(commune.id),
      name: commune.name,
      wilayaId: Number(commune.wilaya ?? wilaya.id),
    })),
  }
}

// normalizeDataset handles this module workflow, using its parameters and returning JSX, data, or a service result.
const normalizeDataset = (payload) => {
  const data = payload?.results || payload?.wilayas || payload || []
  return Array.isArray(data) ? data.map(normalizeWilaya) : []
}

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
