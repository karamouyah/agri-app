import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getLocationTree } from '../services/locationApi'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [wilayas, setWilayas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const data = await getLocationTree()
      if (!active) return
      setWilayas(data)
      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => {
    const wilayaMap = new Map(wilayas.map((wilaya) => [Number(wilaya.id), wilaya]))
    const communeMap = new Map(
      wilayas.flatMap((wilaya) =>
        wilaya.communes.map((commune) => [Number(commune.id), { ...commune, wilayaId: Number(wilaya.id) }]),
      ),
    )

    return {
      wilayas,
      loading,
      getCommunesByWilaya: (wilayaId) => wilayaMap.get(Number(wilayaId))?.communes || [],
      findWilaya: (wilayaId) => wilayaMap.get(Number(wilayaId)) || null,
      findCommune: (communeId) => communeMap.get(Number(communeId)) || null,
    }
  }, [loading, wilayas])

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocations() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error('useLocations must be used within LocationProvider.')
  }

  return context
}
