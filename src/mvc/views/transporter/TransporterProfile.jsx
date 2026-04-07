import { useEffect, useState } from 'react'
import { FiPhone, FiSave, FiTruck } from 'react-icons/fi'
import { getTransporterProfile, updateTransporterProfile } from '../../controllers/transporterController'
import PageHero from '../../../components/PageHero'
import { Card, FormField, Input } from '../../../components/ui'
import WilayaMultiSelect from '../../../components/WilayaMultiSelect'

const initialForm = {
  phoneNumber: '',
  vehicle: '',
  maxLoadKg: '',
  deliveryWilayaIds: [],
}

export default function TransporterProfile() {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const profile = await getTransporterProfile()
      setFormData({
        phoneNumber: profile.phoneNumber || '',
        vehicle: profile.vehicle || '',
        maxLoadKg: profile.maxLoadKg || '',
        deliveryWilayaIds: profile.deliveryWilayaIds || [],
      })
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
    await updateTransporterProfile(formData)
    setMessage('Saved.')

    setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Loading transporter profile...</p>
  }

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Transporter Profile"
        title="Define delivery coverage and load limits"
        description="Mission matching now respects both delivery wilayas and maximum vehicle load, so this profile directly shapes what work appears in your dashboard."
        variant="transporter"
        stats={[
          { label: 'Vehicle', value: formData.vehicle || '-', help: 'Transport equipment used for delivery' },
          { label: 'Max Load', value: formData.maxLoadKg ? `${formData.maxLoadKg} KG` : '-', help: 'Mission load ceiling' },
          { label: 'Coverage', value: formData.deliveryWilayaIds.length, help: 'Delivery wilayas currently selected' },
        ]}
      />

      <Card as="form" onSubmit={handleSubmit} className="space-y-4 p-5">
        <FormField label="Vehicle Type" icon={FiTruck}>
          <Input name="vehicle" value={formData.vehicle} onChange={handleChange} required />
        </FormField>

        <FormField label="Phone Number" icon={FiPhone}>
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </FormField>

        <FormField label="Maximum Load Capacity (KG)">
          <Input name="maxLoadKg" type="number" min="1" value={formData.maxLoadKg} onChange={handleChange} required />
        </FormField>

        <WilayaMultiSelect
          selectedIds={formData.deliveryWilayaIds}
          onChange={(deliveryWilayaIds) => setFormData((prev) => ({ ...prev, deliveryWilayaIds }))}
        />

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary px-4 py-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <FiSave />
              Save
            </span>
          </button>
          {message ? <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{message}</span> : null}
        </div>
      </Card>
    </section>
  )
}
