import fallbackDataset from '../../shared/algeria-locations.json'
import { apiRequest } from './apiClient'

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

const normalizeDataset = (payload) => (payload?.wilayas || payload || []).map(normalizeWilaya)

export const fallbackLocations = normalizeDataset(fallbackDataset)

export async function getLocationTree() {
  try {
    const payload = await apiRequest('/locations/tree/')
    return normalizeDataset(payload)
  } catch (_error) {
    return fallbackLocations
  }
}
