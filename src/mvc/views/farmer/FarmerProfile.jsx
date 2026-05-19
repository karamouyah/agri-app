// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useState } from 'react'
import { FiMapPin, FiPhone, FiSave, FiType } from 'react-icons/fi'
import { getFarmProfile, updateFarmProfile } from '../../controllers/farmerController'
import LocationFields from '../../../components/LocationFields'
import PageHero from '../../../components/PageHero'
import { Card, Input, Textarea } from '../../../components/ui'

const initialForm = {
  name: '',
  location: '',
  description: '',
  contactInfo: '',
  wilaya_id: '',
  commune_id: '',
}

export default function FarmerProfile() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [formData, setFormData] = useState(initialForm)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [message, setMessage] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(true)

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const load = async () => {
      const profile = await getFarmProfile()
      setFormData(profile)
      setLoading(false)
    }

    load()
  }, [])
  // handleChange handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'wilaya_id' ? { commune_id: '' } : {}),
    }))
  }
  // handleSubmit handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleSubmit = async (event) => {
    event.preventDefault()
    await updateFarmProfile(formData)
    setMessage('Saved.')

    setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Loading farm profile...</p>
  }

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Farm Profile"
        title="Update farm details"
        description="Keep your public farm identity polished so buyers, transporters, and ministry users all see consistent information."
        variant="farmer"
        stats={[
          { label: 'Farm', value: formData.name || '-', help: 'Current farm display name' },
          { label: 'Location', value: formData.location_label || formData.locationLabel || formData.location || '-', help: 'Visible farm address and Algeria location' },
          { label: 'Contact', value: formData.contactInfo || '-', help: 'Primary number shown on the platform' },
        ]}
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card as="form" onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <FiType />
                  Farm name
                </span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <FiMapPin />
                  Location
                </span>
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="px-3 py-2"
              />
            </div>

            <div>
              <LocationFields
                wilayaId={formData.wilaya_id}
                communeId={formData.commune_id}
                onChange={handleChange}
                wilayaName="wilaya_id"
                communeName="commune_id"
                hint="The farm commune must belong to the selected wilaya."
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Short note
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                className="px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="contactInfo" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <FiPhone />
                  Contact
                </span>
              </label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                className="px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary px-4 py-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <FiSave />
                  Save
                </span>
              </button>
              {message ? <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{message}</span> : null}
            </div>
          </div>
        </Card>

      </div>
    </section>
  )
}
