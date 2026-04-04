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

export default function TransporterDashboard() {
  const [requests, setRequests] = useState([])
  const [activeDeliveries, setActiveDeliveries] = useState([])

  const load = async () => {
    const [pendingData, activeData] = await Promise.all([getDeliveryRequests(), getActiveDeliveries()])

    setRequests(pendingData)
    setActiveDeliveries(activeData)
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

  return (
    <section className="agri-page space-y-5">
      <PageHero
        eyebrow="Logistics Workspace"
        title="Keep deliveries efficient from pickup to handoff"
        description="Handle mission requests, monitor live delivery work, and keep agricultural logistics moving with a cleaner operations dashboard."
        variant="transporter"
        stats={[
          { label: 'Pending Requests', value: stats.pending, help: 'Available missions awaiting action' },
          { label: 'Active Deliveries', value: stats.active, help: 'Accepted deliveries underway' },
          { label: 'In Transit', value: stats.inTransit, help: 'Current missions on the road' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Requests</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.pending}</p>
        </article>
        <article className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Deliveries</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.active}</p>
        </article>
        <article className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Transit</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.inTransit}</p>
        </article>
      </div>

      <div className="surface-card p-5">
        <h3 className="text-lg font-bold text-slate-900">Pending Delivery Requests</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Pickup</th>
                <th className="px-3 py-2">Delivery</th>
                <th className="px-3 py-2">Deadline</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((mission) => (
                <tr key={mission.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-semibold text-slate-900">{mission.orderId}</td>
                  <td className="px-3 py-2">{mission.pickupLocation}</td>
                  <td className="px-3 py-2">{mission.deliveryLocation}</td>
                  <td className="px-3 py-2">{mission.deadline}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAccept(mission.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        <FiCheckCircle />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecline(mission.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        <FiXCircle />
                        Decline
                      </button>
                      <Link
                        to={`/transporter/delivery/${mission.id}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
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
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No pending delivery requests.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="surface-card p-5">
        <h3 className="text-lg font-bold text-slate-900">Active Deliveries</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Pickup</th>
                <th className="px-3 py-2">Delivery</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {activeDeliveries.map((mission) => (
                <tr key={mission.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-semibold text-slate-900">{mission.orderId}</td>
                  <td className="px-3 py-2">{mission.pickupLocation}</td>
                  <td className="px-3 py-2">{mission.deliveryLocation}</td>
                  <td className="px-3 py-2 capitalize">{mission.status}</td>
                  <td className="px-3 py-2">
                    <Link
                      to={`/transporter/delivery/${mission.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <FiTruck />
                      Update Status
                    </Link>
                  </td>
                </tr>
              ))}
              {activeDeliveries.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No active deliveries.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
