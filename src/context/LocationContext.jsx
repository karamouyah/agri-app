// File responsibility: Provides shared React state so pages and components can read project-wide values without prop drilling.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getLocationTree } from '../services/locationApi'

const LocationContext = createContext(null)

// LocationProvider handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function LocationProvider({ children }) {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [wilayas, setWilayas] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(true)

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    let active = true

    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
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

// useLocations handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function useLocations() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error('useLocations must be used within LocationProvider.')
  }

  return context
}
