import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiClock, FiMapPin, FiSave, FiTruck, FiUser } from 'react-icons/fi'
import { getDeliveryById, updateDeliveryStatus } from '../../controllers/transporterController'
import AgriIllustration from '../../../components/AgriIllustration'
import Reveal from '../../../components/Reveal'

const statusOptions = ['picked up', 'in transit', 'delivered']

export default function TransporterDeliveryDetails() {
  const { id } = useParams()
  const [mission, setMission] = useState(null)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const data = await getDeliveryById(id)
      setMission(data)
      if (data) {
        setStatus(data.status)
      }
    }

    load()
  }, [id])

  const handleUpdate = async () => {
    const updated = await updateDeliveryStatus(id, status)
    setMission(updated)
    setMessage('Status updated.')

    setTimeout(() => {
      setMessage('')
    }, 2000)
  }

  if (!mission) {
    return <p className="text-sm text-slate-600">Delivery mission not found.</p>
  }

  return (
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Delivery mission</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{mission.id}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Order</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{mission.orderId}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Status</p>
                <p className="mt-1 capitalize text-lg font-bold text-slate-900">{mission.status}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Deadline</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{mission.deadline}</p>
              </div>
            </div>
          </div>

          <div className="media-shell p-3">
            <AgriIllustration variant="transporter" className="h-48" />
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Reveal delay={50}>
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="surface-muted p-3">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiMapPin />
                  Pickup
                </p>
                <p className="mt-1 text-slate-600">{mission.pickupLocation}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiMapPin />
                  Delivery
                </p>
                <p className="mt-1 text-slate-600">{mission.deliveryLocation}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiUser />
                  Buyer
                </p>
                <p className="mt-1 text-slate-600">{mission.buyerContact}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                  <FiUser />
                  Farmer
                </p>
                <p className="mt-1 text-slate-600">{mission.farmerContact}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-base font-bold text-slate-900">Update</h3>
            <div className="mt-3 space-y-3">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="field-control w-full px-3 py-2 text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button type="button" onClick={handleUpdate} className="btn-primary w-full px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <FiSave />
                  Save status
                </span>
              </button>

              <Link to="/transporter/dashboard" className="btn-secondary flex w-full justify-center px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <FiTruck />
                  Back
                </span>
              </Link>
            </div>
            {message ? <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
