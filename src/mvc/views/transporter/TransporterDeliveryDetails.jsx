// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiMapPin, FiSave, FiTruck, FiUser } from 'react-icons/fi'
import { getDeliveryById, updateDeliveryStatus } from '../../controllers/transporterController'
import PageHero from '../../../components/PageHero'
import { Card, Select, buttonStyles, cn } from '../../../components/ui'

const statusOptions = ['picked up', 'in transit', 'delivered']

export default function TransporterDeliveryDetails() {
  const { id } = useParams()
  // State: stores local UI data and is updated by event handlers or API responses.
  const [mission, setMission] = useState(null)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [status, setStatus] = useState('')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [message, setMessage] = useState('')

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const load = async () => {
      const data = await getDeliveryById(id)
      setMission(data)
      if (data) {
        setStatus(data.status)
      }
    }

    load()
  }, [id])

// Form/event handling: validates input, updates state, or submits data when the user acts.
  // handleUpdate handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleUpdate = async () => {
    const updated = await updateDeliveryStatus(id, status)
    setMission(updated)
    setMessage('Status updated.')

    setTimeout(() => {
      setMessage('')
    }, 2000)
  }

  if (!mission) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Delivery mission not found.</p>
  }

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Delivery mission"
        title={mission.id}
        description="Review pickup and drop-off details, monitor the active mission status, and update delivery progress without losing dark-mode clarity."
        variant="transporter"
        stats={[
          { label: 'Order', value: mission.orderId, help: 'Order linked to this delivery mission' },
          { label: 'Status', value: mission.status, help: 'Current transporter mission state' },
          { label: 'Deadline', value: mission.deadline, help: 'Expected delivery timing' },
          { label: 'Load', value: `${mission.loadKg} KG`, help: 'Current mission weight' },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-5 text-sm text-slate-700 dark:text-slate-300">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="surface-muted p-3">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <FiMapPin />
                Pickup
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{mission.pickupLocation}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {mission.pickupCommuneName || '-'}, {mission.pickupWilayaName || '-'}
              </p>
            </div>
            <div className="surface-muted p-3">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <FiMapPin />
                Delivery
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{mission.deliveryLocation}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {mission.deliveryCommuneName || '-'}, {mission.deliveryWilayaName || '-'}
              </p>
            </div>
            <div className="surface-muted p-3">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <FiUser />
                Buyer
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{mission.buyerContact}</p>
            </div>
            <div className="surface-muted p-3">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <FiUser />
                Farmer
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{mission.farmerContact}</p>
            </div>
            <div className="surface-muted p-3 md:col-span-2">
              <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <FiTruck />
                Load
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{mission.loadKg} KG</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Update</h3>
          <div className="mt-3 space-y-3">
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="px-3 py-2 text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>

            // Form/event handling: validates input, updates state, or submits data when the user acts.
            <button type="button" onClick={handleUpdate} className="btn-primary w-full px-4 py-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <FiSave />
                Save status
              </span>
            </button>

            <Link to="/transporter/dashboard" className={cn(buttonStyles.secondary, 'flex w-full justify-center px-4 py-3 text-sm')}>
              <span className="inline-flex items-center gap-2">
                <FiTruck />
                Back
              </span>
            </Link>
          </div>
          {message ? <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{message}</p> : null}
        </Card>
      </div>
    </section>
  )
}
