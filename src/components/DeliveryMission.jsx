// File responsibility: Shared transporter mission UI used by dashboard and mission detail pages.
// Used by transporter views to present real shipment/order data consistently.

import { Link } from 'react-router-dom'
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFlag,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiUser,
  FiX,
  FiXCircle,
  FiPhone,
  FiMail,
} from 'react-icons/fi'
import { formatDzd } from '../utils/currency'
import { fallback, formatDate, formatDateTime, locationLine } from '../utils/deliveryMissionFormatters'
import { Card, buttonStyles, cn } from './ui'

const STATUS_LABELS = {
  pending: 'Pending request',
  accepted: 'Accepted',
  declined: 'Declined',
  'picked up': 'Picked up',
  'in transit': 'In transit',
  delivered: 'Delivered',
}

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-100 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-900/40',
  accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/40',
  declined: 'bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900/40',
  'picked up': 'bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900/40',
  'in transit': 'bg-indigo-50 text-indigo-700 ring-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300 dark:ring-indigo-900/40',
  delivered: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
}

export function DeliveryStatusBadge({ status, className = '' }) {
  const key = String(status || 'pending').toLowerCase()
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
        STATUS_STYLES[key] || STATUS_STYLES.pending,
        className,
      )}
    >
      {STATUS_LABELS[key] || status || 'Pending request'}
    </span>
  )
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {Icon ? <Icon className="shrink-0" /> : null}
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  )
}

function ContactInfoCard({ title, contact, roleName }) {
  if (!contact) {
    return (
      <DetailItem icon={FiUser} label={roleName} value={`${roleName} not provided or hidden`} />
    )
  }
  return (
    <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/20">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        <FiUser className="shrink-0" />
        {title}
      </p>
      <div className="mt-2">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{contact.full_name || contact.email}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {contact.phone_number && (
          <a
            href={`tel:${contact.phone_number}`}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          >
            <FiPhone className="shrink-0" /> {contact.phone_number}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-md bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/60"
          >
            <FiMail className="shrink-0" /> {contact.email}
          </a>
        )}
      </div>
    </div>
  )
}

function MissionRoute({ mission }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <FiMapPin />
          Pickup
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {locationLine(mission.pickupCommuneName, mission.pickupWilayaName)}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {fallback(mission.pickupAddress, 'Address not provided')}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <FiMapPin />
          Destination
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {locationLine(mission.deliveryCommuneName, mission.deliveryWilayaName)}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {fallback(mission.deliveryAddress, 'Address not provided')}
        </p>
      </div>
    </div>
  )
}

function MissionItems({ mission }) {
  if (!mission.items?.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Product details are not provided by the API.</p>
  }

  return (
    <div className="space-y-2">
      {mission.items.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800"
        >
          <span className="font-medium text-slate-900 dark:text-slate-100">{item.name}</span>
          <span className="text-slate-600 dark:text-slate-300">
            {item.quantity} {item.unit}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DeliveryMissionCard({
  mission,
  onAccept,
  onDecline,
  onDetails,
  onReport,
  onStatusChange,
  busy = false,
  compact = false,
  framed = true,
  showDetails = true,
}) {
  const firstItem = mission.items?.[0]
  const productLabel = mission.items?.length > 1
    ? `${firstItem?.name || 'Products'} +${mission.items.length - 1} more`
    : firstItem?.name || 'Product not provided'

  const Wrapper = framed ? Card : 'div'
  const wrapperClassName = framed ? 'p-4' : ''

  return (
    <Wrapper className={wrapperClassName}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DeliveryStatusBadge status={mission.status} />
            {mission.orderStatus ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                Order: {mission.orderStatus}
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
            {productLabel}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {fallback(mission.farmerName, 'Farmer not provided')} to {fallback(mission.buyerName, 'Buyer not provided')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mission.status === 'pending' ? (
            <>
              <button type="button" onClick={() => onAccept?.(mission)} disabled={busy} className={buttonStyles.primary}>
                <FiCheckCircle />
                Accept
              </button>
              <button
                type="button"
                onClick={() => onDecline?.(mission)}
                disabled={busy}
                className={cn(buttonStyles.secondary, 'border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300')}
              >
                <FiXCircle />
                Decline
              </button>
            </>
          ) : null}
          {mission.status === 'accepted' ? (
            <button type="button" onClick={() => onStatusChange?.(mission, 'picked up')} disabled={busy} className={buttonStyles.primary}>
              <FiPackage />
              Mark as Picked Up
            </button>
          ) : null}
          {mission.status === 'picked up' ? (
            <button type="button" onClick={() => onStatusChange?.(mission, 'in transit')} disabled={busy} className={buttonStyles.primary}>
              <FiTruck />
              Mark as In Transit
            </button>
          ) : null}
          {mission.status === 'in transit' ? (
            <button type="button" onClick={() => onStatusChange?.(mission, 'delivered')} disabled={busy} className={buttonStyles.primary}>
              <FiCheckCircle />
              Mark as Delivered
            </button>
          ) : null}
          {showDetails && onDetails ? (
            <button type="button" onClick={() => onDetails(mission)} className={buttonStyles.secondary}>
              Details
            </button>
          ) : null}
          {showDetails && !onDetails ? (
            <Link to={`/transporter/delivery/${mission.id}`} className={buttonStyles.secondary}>
              Details
            </Link>
          ) : null}
          {onReport ? (
            <button type="button" onClick={() => onReport(mission)} className={buttonStyles.secondary}>
              <FiFlag />
              Report
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DetailItem icon={FiPackage} label="Quantity" value={`${mission.loadKg || 0} kg`} />
        <DetailItem icon={FiCalendar} label="Order date" value={formatDate(mission.orderDate)} />
        <DetailItem icon={FiClock} label="Request date" value={formatDateTime(mission.deliveryRequestDate)} />
        <DetailItem icon={FiCalendar} label="Deadline" value={formatDate(mission.deadline)} />
      </div>

      {!compact ? (
        <div className="mt-4">
          <MissionRoute mission={mission} />
        </div>
      ) : null}
    </Wrapper>
  )
}

export function DeliveryMissionDetailsModal({ mission, onClose, onAccept, onDecline, onStatusChange, busy = false }) {
  if (!mission) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-4 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <Card className="w-full max-w-4xl p-0">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Mission {mission.trackingNumber || mission.id}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {fallback(mission.farmerName, 'Farmer not provided')} to {fallback(mission.buyerName, 'Buyer not provided')}
              </h2>
            </div>
            <button type="button" onClick={onClose} className={cn(buttonStyles.ghost, 'shrink-0 px-2')} aria-label="Close details">
              <FiX />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <DeliveryMissionCard
              mission={mission}
              onAccept={onAccept}
              onDecline={onDecline}
              onStatusChange={onStatusChange}
              busy={busy}
              compact
              framed={false}
              showDetails={false}
            />

            <MissionRoute mission={mission} />

            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Products to deliver</h3>
                <div className="mt-3">
                  <MissionItems mission={mission} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <DetailItem icon={FiTruck} label="Transport fee" value={mission.shippingFee ? formatDzd(mission.shippingFee) : 'Not provided'} />
                  <DetailItem icon={FiAlertCircle} label="Payment" value={fallback(mission.paymentMethod, 'Not provided')} />
                </div>
                
                <ContactInfoCard title="Buyer Contact" roleName="Buyer" contact={mission.buyerContact} />
                <ContactInfoCard title="Farmer Contact" roleName="Farmer" contact={mission.farmerContact} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function TransporterDashboardStats({ requests, active, completed, declined }) {
  const pickedUp = active.filter((mission) => mission.status === 'picked up').length
  const inTransit = active.filter((mission) => mission.status === 'in transit').length

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Card className="p-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New requests</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{requests.length}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Accepted</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {active.filter((mission) => mission.status === 'accepted').length}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">In progress</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{pickedUp + inTransit}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{completed.length}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Declined/cancelled</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{declined.length}</p>
      </Card>
    </div>
  )
}
