import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  acceptMission,
  declineMission,
  getActiveDeliveries,
  getDeliveryRequests,
} from '../../mvc/controllers/transporterController'

export default function TransporterDashboard() {
  const [requests, setRequests] = useState([])
  const [activeDeliveries, setActiveDeliveries] = useState([])

  const load = async () => {
    const [pendingData, activeData] = await Promise.all([
      getDeliveryRequests(),
      getActiveDeliveries(),
    ])

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

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Transporter Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage pending missions and active deliveries.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-800">Pending Delivery Requests</h3>
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
                  <td className="px-3 py-2">{mission.orderId}</td>
                  <td className="px-3 py-2">{mission.pickupLocation}</td>
                  <td className="px-3 py-2">{mission.deliveryLocation}</td>
                  <td className="px-3 py-2">{mission.deadline}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAccept(mission.id)}
                        className="rounded-md border border-emerald-300 px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecline(mission.id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Decline
                      </button>
                      <Link
                        to={`/transporter/delivery/${mission.id}`}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <p className="mt-3 text-sm text-slate-600">No pending delivery requests.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-800">Active Deliveries</h3>
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
                  <td className="px-3 py-2">{mission.orderId}</td>
                  <td className="px-3 py-2">{mission.pickupLocation}</td>
                  <td className="px-3 py-2">{mission.deliveryLocation}</td>
                  <td className="px-3 py-2 capitalize">{mission.status}</td>
                  <td className="px-3 py-2">
                    <Link
                      to={`/transporter/delivery/${mission.id}`}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                    >
                      Update Status
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activeDeliveries.length === 0 && (
            <p className="mt-3 text-sm text-slate-600">No active deliveries.</p>
          )}
        </div>
      </div>
    </section>
  )
}
