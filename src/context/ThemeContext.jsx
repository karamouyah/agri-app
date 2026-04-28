// File responsibility: Provides shared React state so pages and components can read project-wide values without prop drilling.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const THEME_STORAGE_KEY = 'agri-theme-mode'
const VALID_THEME_MODES = ['auto', 'dark', 'light']
const DARK_THEME_COLOR = '#0f172a'
const LIGHT_THEME_COLOR = '#2d8b4d'

const ThemeContext = createContext({
  mode: 'auto',
  resolvedTheme: 'light',
  setMode: () => {},
  cycleMode: () => {},
})

// getStoredThemeMode handles this module workflow, using its parameters and returning JSX, data, or a service result.
function getStoredThemeMode() {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return VALID_THEME_MODES.includes(stored) ? stored : 'auto'
}

// getSystemTheme handles this module workflow, using its parameters and returning JSX, data, or a service result.
function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// applyTheme handles this module workflow, using its parameters and returning JSX, data, or a service result.
function applyTheme(mode, resolvedTheme) {
  const root = document.documentElement
  const nextTheme = resolvedTheme || (mode === 'auto' ? getSystemTheme() : mode)
  root.classList.toggle('dark', nextTheme === 'dark')
  root.dataset.themeMode = mode
  root.style.colorScheme = nextTheme

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', nextTheme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR)
  }

  window.requestAnimationFrame(() => {
    root.classList.add('theme-ready')
  })

  return nextTheme
}

// ThemeProvider handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function ThemeProvider({ children }) {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [mode, setModeState] = useState(getStoredThemeMode)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const initialMode = getStoredThemeMode()
    return initialMode === 'auto' ? getSystemTheme() : initialMode
  })

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // syncTheme handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const syncTheme = () => {
      const nextResolvedTheme = mode === 'auto' ? (mediaQuery.matches ? 'dark' : 'light') : mode
      setResolvedTheme(nextResolvedTheme)
      applyTheme(mode, nextResolvedTheme)
    }

    syncTheme()
    // handleChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const handleChange = () => {
      if (mode === 'auto') {
        syncTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode])

  // setMode handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const setMode = (nextMode) => {
    const sanitizedMode = VALID_THEME_MODES.includes(nextMode) ? nextMode : 'auto'
    setModeState(sanitizedMode)
    window.localStorage.setItem(THEME_STORAGE_KEY, sanitizedMode)
  }

  // cycleMode handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const cycleMode = () => {
    const order = ['auto', 'dark', 'light']
    const currentIndex = order.indexOf(mode)
    const nextMode = order[(currentIndex + 1) % order.length]
    setMode(nextMode)
  }

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      cycleMode,
    }),
    [mode, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// useTheme handles this module workflow, using its parameters and returning JSX, data, or a service result.
export function useTheme() {
  return useContext(ThemeContext)
}
