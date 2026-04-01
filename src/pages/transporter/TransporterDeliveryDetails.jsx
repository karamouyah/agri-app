import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDeliveryById, updateDeliveryStatus } from '../../mvc/controllers/transporterController'

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
    setMessage('Delivery status updated.')

    setTimeout(() => {
      setMessage('')
    }, 2000)
  }

  if (!mission) {
    return <p className="text-sm text-slate-600">Delivery mission not found.</p>
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Delivery Details</h2>
        <p className="mt-1 text-sm text-slate-600">Mission ID: {mission.id}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <div className="grid gap-2 md:grid-cols-2">
          <p>
            <span className="font-medium">Order ID:</span> {mission.orderId}
          </p>
          <p>
            <span className="font-medium">Current Status:</span>{' '}
            <span className="capitalize">{mission.status}</span>
          </p>
          <p className="md:col-span-2">
            <span className="font-medium">Pickup Address:</span> {mission.pickupLocation}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium">Delivery Address:</span> {mission.deliveryLocation}
          </p>
          <p>
            <span className="font-medium">Buyer Contact:</span> {mission.buyerContact}
          </p>
          <p>
            <span className="font-medium">Farmer Contact:</span> {mission.farmerContact}
          </p>
          <p>
            <span className="font-medium">Deadline:</span> {mission.deadline}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-800">Update Status</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleUpdate}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save Status
          </button>

          <Link
            to="/transporter/dashboard"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
          >
            Back to Dashboard
          </Link>
        </div>
        {message && <p className="mt-2 text-sm text-emerald-700">{message}</p>}
      </div>
    </section>
  )
}
