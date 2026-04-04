import { useEffect, useState } from 'react'
import { FiMapPin, FiPhone, FiSave, FiType } from 'react-icons/fi'
import { getFarmProfile, updateFarmProfile } from '../../controllers/farmerController'
import AgriIllustration from '../../../components/AgriIllustration'
import Reveal from '../../../components/Reveal'

const initialForm = {
  name: '',
  location: '',
  description: '',
  contactInfo: '',
}

export default function FarmerProfile() {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const profile = await getFarmProfile()
      setFormData(profile)
      setLoading(false)
    }

    load()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await updateFarmProfile(formData)
    setMessage('Saved.')

    setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Loading farm profile...</p>
  }

  return (
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Farm Profile</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Update farm details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Farm</p>
                <p className="mt-1 truncate text-lg font-bold text-slate-900">{formData.name || '-'}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Location</p>
                <p className="mt-1 truncate text-lg font-bold text-slate-900">{formData.location || '-'}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Contact</p>
                <p className="mt-1 truncate text-lg font-bold text-slate-900">{formData.contactInfo || '-'}</p>
              </div>
            </div>
          </div>

          <div className="media-shell p-3">
            <AgriIllustration variant="farmer" className="h-48" />
          </div>
        </div>
      </Reveal>

      <Reveal delay={70}>
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <FiType />
                  Farm name
                </span>
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="field-control w-full px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <FiMapPin />
                  Location
                </span>
              </label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="field-control w-full px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                Short note
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                className="field-control w-full px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="contactInfo" className="mb-1 block text-sm font-medium text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <FiPhone />
                  Contact
                </span>
              </label>
              <input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                className="field-control w-full px-3 py-2"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button type="submit" className="btn-primary px-4 py-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <FiSave />
                  Save
                </span>
              </button>
              {message ? <span className="text-sm font-semibold text-emerald-700">{message}</span> : null}
            </div>
          </div>
        </form>
      </Reveal>
    </section>
  )
}
