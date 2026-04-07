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

function getStoredThemeMode() {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return VALID_THEME_MODES.includes(stored) ? stored : 'auto'
}

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

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

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(getStoredThemeMode)
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const initialMode = getStoredThemeMode()
    return initialMode === 'auto' ? getSystemTheme() : initialMode
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const syncTheme = () => {
      const nextResolvedTheme = mode === 'auto' ? (mediaQuery.matches ? 'dark' : 'light') : mode
      setResolvedTheme(nextResolvedTheme)
      applyTheme(mode, nextResolvedTheme)
    }

    syncTheme()

    const handleChange = () => {
      if (mode === 'auto') {
        syncTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode])

  const setMode = (nextMode) => {
    const sanitizedMode = VALID_THEME_MODES.includes(nextMode) ? nextMode : 'auto'
    setModeState(sanitizedMode)
    window.localStorage.setItem(THEME_STORAGE_KEY, sanitizedMode)
  }

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

export function useTheme() {
  return useContext(ThemeContext)
}
