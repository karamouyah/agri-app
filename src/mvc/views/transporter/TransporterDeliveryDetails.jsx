// File responsibility: Shows one transporter delivery mission with actionable shipment progress controls.
// Used by the React router at /transporter/delivery/:id.

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiAlertCircle, FiArrowLeft, FiCheckCircle, FiMapPin, FiPackage, FiTruck, FiUser } from 'react-icons/fi'
import { getDeliveryById, updateDeliveryStatus } from '../../controllers/transporterController'
import {
  DeliveryMissionCard,
  DeliveryStatusBadge,
} from '../../../components/DeliveryMission'
import { fallback, formatDate, formatDateTime, locationLine } from '../../../utils/deliveryMissionFormatters'
import { formatDzd } from '../../../utils/currency'
import { Card, EmptyState, PageHeader, SkeletonBlock, buttonStyles, cn } from '../../../components/ui'

function DetailBlock({ icon, label, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </p>
      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  )
}

export default function TransporterDeliveryDetails() {
  const { id } = useParams()
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setMission(await getDeliveryById(id))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load this delivery mission.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // Mission ID is the only routing dependency for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleStatusChange = async (targetMission, status) => {
    setBusy(true)
    setError('')
    try {
      const updated = await updateDeliveryStatus(targetMission.id, status)
      setMission(updated)
      setMessage('Delivery status updated.')
      setTimeout(() => setMessage(''), 2000)
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update this delivery mission.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <section className="app-page">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-56" />
        <SkeletonBlock className="h-64" />
      </section>
    )
  }

  if (!mission) {
    return (
      <EmptyState
        icon={FiAlertCircle}
        title="Delivery mission not found"
        description={error || 'This mission may no longer be assigned to your transporter account.'}
        action={{ to: '/transporter/dashboard', label: 'Back to dashboard' }}
      />
    )
  }

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Delivery mission"
        title={`Mission ${mission.trackingNumber || mission.id}`}
        description={`${fallback(mission.farmerName, 'Farmer not provided')} to ${fallback(mission.buyerName, 'Buyer not provided')}`}
        actions={
          <Link to="/transporter/dashboard" className={buttonStyles.secondary}>
            <FiArrowLeft />
            Dashboard
          </Link>
        }
        meta={[
          { label: 'Shipment status', value: <DeliveryStatusBadge status={mission.status} /> },
          { label: 'Order status', value: mission.orderStatus || 'Not provided' },
          { label: 'Deadline', value: formatDate(mission.deadline) },
        ]}
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </Card>
      ) : null}
      {message ? (
        <Card className="border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
          {message}
        </Card>
      ) : null}

      <DeliveryMissionCard
        mission={mission}
        onStatusChange={handleStatusChange}
        busy={busy}
        showDetails={false}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Mission details</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <DetailBlock icon={<FiMapPin />} label="Pickup location">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {locationLine(mission.pickupCommuneName, mission.pickupWilayaName)}
              </p>
              <p className="mt-1">{fallback(mission.pickupAddress, 'Address not provided')}</p>
            </DetailBlock>
            <DetailBlock icon={<FiMapPin />} label="Delivery destination">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {locationLine(mission.deliveryCommuneName, mission.deliveryWilayaName)}
              </p>
              <p className="mt-1">{fallback(mission.deliveryAddress, 'Address not provided')}</p>
            </DetailBlock>
            <DetailBlock icon={<FiUser />} label="Farmer">
              <p>{fallback(mission.farmerName, 'Farmer not provided')}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{fallback(mission.farmerContact, 'Contact not provided')}</p>
            </DetailBlock>
            <DetailBlock icon={<FiUser />} label="Buyer">
              <p>{fallback(mission.buyerName, 'Buyer not provided')}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">{fallback(mission.buyerContact, 'Contact not provided')}</p>
            </DetailBlock>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">Order date</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{formatDate(mission.orderDate)}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">Request date</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{formatDateTime(mission.deliveryRequestDate)}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">Transport fee</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{mission.shippingFee ? formatDzd(mission.shippingFee) : 'Not provided'}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">Payment</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{mission.paymentMethod || 'Not provided'}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">Distance</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">Not provided by backend</span>
            </p>
            <p className="flex justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400">Priority</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">Not provided by backend</span>
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          <FiPackage />
          Products to deliver
        </h2>
        <div className="mt-4 overflow-x-auto">
          {mission.items.length ? (
            <table className="table-base w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {mission.items.map((item, index) => (
                  <tr key={`${item.name}-${index}`}>
                    <td className="font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>{formatDzd(item.unitPrice)}</td>
                    <td>{formatDzd(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Product details are not provided for this mission.
            </p>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          <FiTruck />
          Status actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleStatusChange(mission, 'picked up')}
            disabled={busy || mission.status !== 'accepted'}
            className={buttonStyles.primary}
          >
            <FiPackage />
            Mark as Picked Up
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange(mission, 'in transit')}
            disabled={busy || mission.status !== 'picked up'}
            className={buttonStyles.primary}
          >
            <FiTruck />
            Mark as In Transit
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange(mission, 'delivered')}
            disabled={busy || mission.status !== 'in transit'}
            className={buttonStyles.primary}
          >
            <FiCheckCircle />
            Mark as Delivered
          </button>
          <Link to="/transporter/dashboard" className={cn(buttonStyles.secondary, 'ml-0 sm:ml-auto')}>
            Back to missions
          </Link>
        </div>
      </Card>
    </section>
  )
}
