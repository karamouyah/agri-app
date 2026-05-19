// File responsibility: Renders the transporter workspace with real delivery requests and missions.
// Used by the React router for transporter users.

import { useEffect, useMemo, useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiClock, FiFileText, FiInbox, FiTruck, FiXCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import {
  acceptMission,
  declineMission,
  getActiveDeliveries,
  getCompletedDeliveries,
  getDeclinedDeliveries,
  getDeliveryRequests,
  updateDeliveryStatus,
} from '../../controllers/transporterController'
import {
  DeliveryMissionCard,
  DeliveryMissionDetailsModal,
  TransporterDashboardStats,
} from '../../../components/DeliveryMission'
import { Card, EmptyState, PageHeader, SkeletonBlock, buttonStyles, cn } from '../../../components/ui'
import ReportModal from '../../../components/ReportModal'

function MissionSection({ id, title, description, icon: Icon, missions, emptyTitle, emptyDescription, actionProps }) {
  return (
    <section id={id} className="space-y-3">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {Icon ? <Icon className="text-emerald-600 dark:text-emerald-300" /> : null}
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{missions.length} mission{missions.length === 1 ? '' : 's'}</span>
      </div>

      {missions.length ? (
        <div className="grid gap-3">
          {missions.map((mission) => (
            <DeliveryMissionCard key={mission.id} mission={mission} {...actionProps} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Icon || FiInbox} title={emptyTitle} description={emptyDescription} className="py-8" />
      )}
    </section>
  )
}

export default function TransporterDashboard() {
  const [requests, setRequests] = useState([])
  const [activeDeliveries, setActiveDeliveries] = useState([])
  const [completedDeliveries, setCompletedDeliveries] = useState([])
  const [declinedDeliveries, setDeclinedDeliveries] = useState([])
  const [selectedMission, setSelectedMission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyMissionId, setBusyMissionId] = useState('')
  const [reportTarget, setReportTarget] = useState(null)

  const acceptedMissions = useMemo(
    () => activeDeliveries.filter((mission) => mission.status === 'accepted'),
    [activeDeliveries],
  )
  const inProgressMissions = useMemo(
    () => activeDeliveries.filter((mission) => ['picked up', 'in transit'].includes(mission.status)),
    [activeDeliveries],
  )

  const load = async () => {
    setError('')
    try {
      const [pendingData, activeData, completedData, declinedData] = await Promise.all([
        getDeliveryRequests(),
        getActiveDeliveries(),
        getCompletedDeliveries(),
        getDeclinedDeliveries(),
      ])
      setRequests(pendingData)
      setActiveDeliveries(activeData)
      setCompletedDeliveries(completedData)
      setDeclinedDeliveries(declinedData)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load transporter missions right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const runMissionAction = async (mission, action) => {
    setBusyMissionId(mission.id)
    setError('')
    try {
      const updated = await action()
      setSelectedMission((current) => (current?.id === mission.id ? updated : current))
      await load()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Unable to update this mission.')
    } finally {
      setBusyMissionId('')
    }
  }

  const handleAccept = (mission) => runMissionAction(mission, () => acceptMission(mission.id))
  const handleDecline = (mission) => runMissionAction(mission, () => declineMission(mission.id))
  const handleStatusChange = (mission, status) => runMissionAction(mission, () => updateDeliveryStatus(mission.id, status))

  const actionProps = {
    onAccept: handleAccept,
    onDecline: handleDecline,
    onDetails: setSelectedMission,
    onReport: setReportTarget,
    onStatusChange: handleStatusChange,
    busy: Boolean(busyMissionId),
  }

  if (loading) {
    return (
      <section className="app-page">
        <SkeletonBlock className="h-28" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
        </div>
        <SkeletonBlock className="h-72" />
      </section>
    )
  }

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Transporter workspace"
        title="Delivery missions"
        description="Review each delivery request, confirm pickup and destination details, then update shipment progress as the mission moves."
        actions={
          <div className="flex flex-wrap gap-2">
            <a href="#new-requests" className={cn(buttonStyles.secondary, 'px-3 py-2')}>Requests</a>
            <a href="#accepted" className={cn(buttonStyles.secondary, 'px-3 py-2')}>Accepted</a>
            <a href="#in-progress" className={cn(buttonStyles.secondary, 'px-3 py-2')}>In progress</a>
          </div>
        }
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </Card>
      ) : null}

      <TransporterDashboardStats
        requests={requests}
        active={activeDeliveries}
        completed={completedDeliveries}
        declined={declinedDeliveries}
      />

      <MissionSection
        id="new-requests"
        title="New delivery requests"
        description="Pending shipments matching your delivery wilayas and maximum load capacity."
        icon={FiClock}
        missions={requests}
        emptyTitle="No new requests"
        emptyDescription="There are no pending delivery requests that match your coverage and vehicle capacity."
        actionProps={actionProps}
      />

      <MissionSection
        id="accepted"
        title="Accepted missions"
        description="Missions you accepted and should pick up next."
        icon={FiCheckCircle}
        missions={acceptedMissions}
        emptyTitle="No accepted missions"
        emptyDescription="Accepted delivery missions will appear here before you mark them as picked up."
        actionProps={actionProps}
      />

      <MissionSection
        id="in-progress"
        title="In-progress deliveries"
        description="Shipments already picked up or moving toward the buyer."
        icon={FiTruck}
        missions={inProgressMissions}
        emptyTitle="No deliveries in progress"
        emptyDescription="Once you mark a mission as picked up or in transit, it will be tracked here."
        actionProps={actionProps}
      />

      <MissionSection
        id="completed"
        title="Completed deliveries"
        description="Delivered missions are kept here for quick confirmation."
        icon={FiCheckCircle}
        missions={completedDeliveries}
        emptyTitle="No completed deliveries"
        emptyDescription="Delivered missions will appear here after you mark them as delivered."
        actionProps={actionProps}
      />

      <MissionSection
        id="declined"
        title="Declined or cancelled missions"
        description="Missions declined by you or unavailable after cancellation."
        icon={FiXCircle}
        missions={declinedDeliveries}
        emptyTitle="No declined missions"
        emptyDescription="Declined or cancelled missions will be listed here when they exist."
        actionProps={actionProps}
      />



      <DeliveryMissionDetailsModal
        mission={selectedMission}
        onClose={() => setSelectedMission(null)}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onStatusChange={handleStatusChange}
        busy={Boolean(busyMissionId)}
      />
      <ReportModal
        open={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        title="Report delivery mission"
        target={{
          category: 'shipment',
          relatedShipmentId: reportTarget?.id,
          relatedOrderId: reportTarget?.orderId,
          label: reportTarget ? `Mission ${reportTarget?.trackingNumber || reportTarget?.id}` : '',
        }}
      />
    </section>
  )
}
