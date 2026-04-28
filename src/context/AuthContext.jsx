// File responsibility: Provides shared React state so pages and components can read project-wide values without prop drilling.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginService, logout as logoutController } from '../mvc/controllers/authController'

const AuthContext = createContext(null)

const STORAGE_KEY = 'agri_auth_user'

// AuthProvider handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function AuthProvider({ children }) {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [user, setUser] = useState(null)

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  // login handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const login = async (credentials) => {
    const nextUser = await loginService(credentials)
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    return nextUser
  }

  // logout handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    logoutController()
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// useAuth handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
