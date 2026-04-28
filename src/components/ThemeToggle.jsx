// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { cn } from './ui'

export default function ThemeToggle({ className = '' }) {
  const { mode, resolvedTheme, cycleMode } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const label = mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'

  return (
    <button
      type="button"
      onClick={cycleMode}
      aria-label={`Theme mode: ${label}. Click to cycle theme mode.`}
      title={`Theme mode: ${label}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/70 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-slate-700 dark:hover:text-slate-50 dark:focus-visible:ring-emerald-900',
        className,
      )}
    >
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">
        <FiSun
          className={cn(
            'absolute text-base transition duration-300',
            isDark ? 'translate-y-3 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100',
          )}
        />
        <FiMoon
          className={cn(
            'absolute text-base transition duration-300',
            isDark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-3 -rotate-90 opacity-0',
          )}
        />
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
