// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useMemo, useState } from 'react'
import { FiMap, FiSearch } from 'react-icons/fi'
import { useLocations } from '../context/LocationContext'
import { FormField, Input, cn } from './ui'

export default function WilayaMultiSelect({
  selectedIds = [],
  onChange,
  label = 'Delivery Wilayas',
  hint = 'Select one or more wilayas the transporter can serve.',
}) {
  const { loading, wilayas } = useLocations()
  // State: stores local UI data and is updated by event handlers or API responses.
  const [query, setQuery] = useState('')

  const selectedSet = useMemo(() => new Set(selectedIds.map((item) => Number(item))), [selectedIds])

  const filteredWilayas = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return wilayas
    return wilayas.filter(
      (wilaya) =>
        wilaya.name.toLowerCase().includes(normalized) ||
        String(wilaya.code).includes(normalized),
    )
  }, [query, wilayas])

  // toggleWilaya handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const toggleWilaya = (wilayaId) => {
    const normalizedId = Number(wilayaId)
    const next = selectedSet.has(normalizedId)
      ? selectedIds.filter((item) => Number(item) !== normalizedId)
      : [...selectedIds, normalizedId]
    onChange(next)
  }

  return (
    <FormField label={label} icon={FiMap} hint={hint}>
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search wilayas..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedIds.length === 0 ? (
            <span className="text-sm text-slate-500 dark:text-slate-400">No delivery wilayas selected yet.</span>
          ) : (
            selectedIds.map((id) => {
              const wilaya = wilayas.find((item) => Number(item.id) === Number(id))
              if (!wilaya) return null
              return (
                <button
                  key={wilaya.id}
                  type="button"
                  onClick={() => toggleWilaya(wilaya.id)}
                  className="badge-soft px-3 py-1.5 text-xs"
                >
                  {wilaya.name}
                </button>
              )
            })
          )}
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-0 dark:border-slate-800 dark:bg-slate-950/40">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading wilayas...</p>
          ) : filteredWilayas.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No wilayas matched your search.</p>
          ) : (
            filteredWilayas.map((wilaya) => {
              const active = selectedSet.has(Number(wilaya.id))
              return (
                <button
                  key={wilaya.id}
                  type="button"
                  onClick={() => toggleWilaya(wilaya.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition',
                    active
                      ? 'border-emerald-500 bg-emerald-50 text-slate-900 dark:border-emerald-500/60 dark:bg-emerald-950/30 dark:text-slate-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-slate-800',
                  )}
                >
                  <span>
                    {wilaya.code} - {wilaya.name}
                  </span>
                  <span className="text-xs font-semibold">{active ? 'Selected' : 'Select'}</span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </FormField>
  )
}

