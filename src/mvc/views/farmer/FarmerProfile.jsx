import { useEffect, useState } from 'react'
import { getFarmProfile, updateFarmProfile } from '../../controllers/farmerController'

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
    setMessage('Farm profile saved successfully.')

    setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Loading farm profile...</p>
  }

  return (
    <section className="agri-page rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-slate-800">Manage Farm Profile</h2>
      <p className="mt-1 text-sm text-slate-600">Update your farm details and contact information.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Farm Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contactInfo" className="mb-1 block text-sm font-medium text-slate-700">
            Contact Info
          </label>
          <input
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save Profile
          </button>
          {message && <span className="text-sm text-emerald-700">{message}</span>}
        </div>
      </form>
    </section>
  )
}


