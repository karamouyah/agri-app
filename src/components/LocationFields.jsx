// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { FiMapPin } from 'react-icons/fi'
import { useLocations } from '../context/LocationContext'
import { FormField, Select } from './ui'

export default function LocationFields({
  wilayaId,
  communeId,
  onChange,
  wilayaName = 'wilayaId',
  communeName = 'communeId',
  wilayaLabel = 'Wilaya',
  communeLabel = 'Commune',
  required = true,
  hint = '',
}) {
  const { loading, wilayas, getCommunesByWilaya } = useLocations()
  const communes = getCommunesByWilaya(wilayaId)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField label={wilayaLabel} icon={FiMapPin} hint={hint}>
        <Select name={wilayaName} value={wilayaId || ''} onChange={onChange} required={required} disabled={loading}>
          <option value="">{loading ? 'Loading wilayas...' : 'Select wilaya'}</option>
          {wilayas.map((wilaya) => (
            <option key={wilaya.id} value={wilaya.id}>
              {wilaya.code} - {wilaya.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label={communeLabel}
        icon={FiMapPin}
        hint={!wilayaId ? 'Select a wilaya first to unlock communes.' : ''}
      >
        <Select
          name={communeName}
          value={communeId || ''}
          onChange={onChange}
          required={required}
          disabled={loading || !wilayaId}
        >
          <option value="">
            {!wilayaId ? 'Select wilaya first' : communes.length ? 'Select commune' : 'No communes available'}
          </option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.name}
            </option>
          ))}
        </Select>
      </FormField>
    </div>
  )
}
