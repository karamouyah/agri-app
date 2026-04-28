// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiTruck, FiXCircle } from 'react-icons/fi'
import {
  acceptMission,
  declineMission,
  getActiveDeliveries,
  getDeliveryRequests,
} from '../../controllers/transporterController'
import { useAuth } from '../../../context/AuthContext'
import PageHero from '../../../components/PageHero'
import { Card, SkeletonBlock, StatCard, StatusBadge, buttonStyles, cn } from '../../../components/ui'

export default function TransporterDashboard() {
  const { user } = useAuth()
  // State: stores local UI data and is updated by event handlers or API responses.
  const [requests, setRequests] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [activeDeliveries, setActiveDeliveries] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(true)

  // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const load = async () => {
    const [pendingData, activeData] = await Promise.all([getDeliveryRequests(), getActiveDeliveries()])
    setRequests(pendingData)
    setActiveDeliveries(activeData)
    setLoading(false)
  }

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    load()
  }, [])
  // handleAccept handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleAccept = async (id) => {
    await acceptMission(id)
    load()
  }
  // handleDecline handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleDecline = async (id) => {
    await declineMission(id)
    load()
  }

  if (loading) {
    return (
      <section className="app-page">
        <SkeletonBlock className="h-[200px]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-32" />
        </div>
        <SkeletonBlock className="h-96" />
      </section>
    )
  }

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Workspace"
        title={`Welcome, ${user?.name || 'Transporter'}`}
        description="Manage inbound freight requests and track your active moving shipments across the national network."
        stats={[
          { label: 'Active Jobs', value: activeDeliveries.length, help: 'Currently in progress' },
          { label: 'Pending Requests', value: requests.length, help: 'Awaiting your action' }
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiTruck} label="Active Fleet" value={activeDeliveries.length} help="Active transit orders" tone="sky" />
        <StatCard icon={FiClock} label="Pending Offers" value={requests.length} help="Awaiting decision" tone="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Open Requests</h3>
            <p className="text-sm text-slate-500">Available loads awaiting acceptance.</p>
          </div>
          <div className="p-0">
            <table className="table-base w-full">
              <thead>
                <tr>
                  <th className="text-left">Route</th>
                  <th className="text-left">Volume</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {req.origin} ? {req.destination}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">ID: {req.id}</div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-300">{req.volume} kg</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                        >
                          <FiCheckCircle /> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                        >
                          <FiXCircle /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                      No open delivery requests.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Active Deliveries</h3>
            <p className="text-sm text-slate-500">Shipments currently assigned to you.</p>
          </div>
          <div className="p-0">
            <table className="table-base w-full">
              <thead>
                <tr>
                  <th className="text-left">Route</th>
                  <th className="text-left">Volume</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {activeDeliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {delivery.origin} ? {delivery.destination}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">ID: {delivery.id}</div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-300">{delivery.volume} kg</td>
                    <td>
                      <StatusBadge status={delivery.status} />
                    </td>
                    <td className="text-right">
                      <Link to={"/transporter/jobs/"} className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400">
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
                {activeDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                      You have no active deliveries.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}

