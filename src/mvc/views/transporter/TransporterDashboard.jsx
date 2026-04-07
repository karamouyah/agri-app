import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiTruck, FiXCircle } from 'react-icons/fi'
import {
  acceptMission,
  declineMission,
  getActiveDeliveries,
  getDeliveryRequests,
} from '../../controllers/transporterController'
import PageHero from '../../../components/PageHero'
import { Card, SkeletonBlock, StatCard, StatusBadge, buttonStyles, cn } from '../../../components/ui'

export default function TransporterDashboard() {
  const [requests, setRequests] = useState([])
  const [activeDeliveries, setActiveDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [pendingData, activeData] = await Promise.all([getDeliveryRequests(), getActiveDeliveries()])
    setRequests(pendingData)
    setActiveDeliveries(activeData)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAccept = async (id) => {
    await acceptMission(id)
    await load()
  }

  const handleDecline = async (id) => {
    await declineMission(id)
    await load()
  }

  const stats = useMemo(
    () => ({
      pending: requests.length,
      active: activeDeliveries.length,
      inTransit: activeDeliveries.filter((item) => item.status === 'in transit').length,
    }),
    [requests, activeDeliveries],
  )

  if (loading) {
    return (
      <section className="app-page">
        <SkeletonBlock className="h-[340px]" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-36" />
          ))}
        </div>
        <SkeletonBlock className="h-96" />
      </section>
    )
  }

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Logistics Workspace"
        title="Keep deliveries moving with better field visibility"
        description="Handle mission requests, monitor active loads, and update agricultural deliveries from a cleaner dispatch dashboard."
        variant="transporter"
        stats={[
          { label: 'Pending Requests', value: stats.pending, help: 'Available missions waiting for action' },
          { label: 'Active Deliveries', value: stats.active, help: 'Accepted assignments in progress' },
          { label: 'In Transit', value: stats.inTransit, help: 'Current deliveries already on the road' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FiClock} label="Pending Requests" value={stats.pending} help="Awaiting your response" tone="slate" />
        <StatCard icon={FiTruck} label="Active Deliveries" value={stats.active} help="Missions underway now" tone="sky" />
        <StatCard icon={FiCheckCircle} label="In Transit" value={stats.inTransit} help="Loads already moving" />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-5 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Pending Missions</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Requests awaiting dispatch acceptance</h3>
        </div>
        <div className="table-shell m-4 mt-0">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Load</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((mission) => (
                  <tr key={mission.id}>
                    <td className="font-semibold text-slate-900">{mission.orderId}</td>
                    <td>{mission.pickupLocation}</td>
                    <td>{mission.deliveryLocation}</td>
                    <td>{mission.loadKg} KG</td>
                    <td>{mission.deadline}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccept(mission.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <FiCheckCircle />
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecline(mission.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <FiXCircle />
                          Decline
                        </button>
                        <Link
                          to={`/transporter/delivery/${mission.id}`}
                          className={cn(buttonStyles.secondary, 'px-3 py-2 text-xs')}
                        >
                          <FiClock />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No pending delivery requests.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-5 py-5 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Active Deliveries</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Current mission board</h3>
        </div>
        <div className="table-shell m-4 mt-0">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Pickup</th>
                  <th>Delivery</th>
                  <th>Load</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {activeDeliveries.map((mission) => (
                  <tr key={mission.id}>
                    <td className="font-semibold text-slate-900">{mission.orderId}</td>
                    <td>{mission.pickupLocation}</td>
                    <td>{mission.deliveryLocation}</td>
                    <td>{mission.loadKg} KG</td>
                    <td>
                      <StatusBadge status={mission.status} />
                    </td>
                    <td>
                      <Link
                        to={`/transporter/delivery/${mission.id}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/45"
                      >
                        <FiTruck />
                        Update Status
                      </Link>
                    </td>
                  </tr>
                ))}
                {activeDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No active deliveries.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  )
}
