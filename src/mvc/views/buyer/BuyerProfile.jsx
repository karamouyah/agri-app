import { useEffect, useState } from 'react'
import { FiPhone, FiSave, FiType } from 'react-icons/fi'
import { getBuyerProfile, updateBuyerProfile } from '../../controllers/buyerController'
import LocationFields from '../../../components/LocationFields'
import PageHero from '../../../components/PageHero'
import { Card, FormField, Input } from '../../../components/ui'

const initialForm = {
  address: '',
  phoneNumber: '',
  wilayaId: '',
  communeId: '',
}

export default function BuyerProfile() {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const profile = await getBuyerProfile()
      setFormData({
        address: profile.streetAddress || '',
        phoneNumber: profile.phoneNumber || '',
        wilayaId: profile.wilayaId || '',
        communeId: profile.communeId || '',
      })
      setLoading(false)
    }

    load()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'wilayaId' ? { communeId: '' } : {}),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await updateBuyerProfile(formData)
    setMessage('Saved.')

    setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Loading buyer profile...</p>
  }

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Buyer Profile"
        title="Keep your buyer location accurate"
        description="Your wilaya and commune now power delivery validation, buyer account details, and structured order destinations."
        variant="buyer"
        stats={[
          { label: 'Address', value: formData.address || '-', help: 'Primary buyer street address' },
          { label: 'Wilaya', value: formData.wilayaId || '-', help: 'Structured Algeria region selection' },
          { label: 'Commune', value: formData.communeId || '-', help: 'Commune linked to the selected wilaya' },
        ]}
      />

      <Card as="form" onSubmit={handleSubmit} className="space-y-4 p-5">
        <FormField label="Street Address" icon={FiType}>
          <Input name="address" value={formData.address} onChange={handleChange} required />
        </FormField>

        <FormField label="Phone Number" icon={FiPhone}>
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </FormField>

        <LocationFields
          wilayaId={formData.wilayaId}
          communeId={formData.communeId}
          onChange={handleChange}
          hint="Orders and delivery validation use this buyer wilaya and commune."
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
