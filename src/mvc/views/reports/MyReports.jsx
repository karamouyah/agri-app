import { useEffect, useMemo, useState } from 'react'
import { FiFlag } from 'react-icons/fi'
import { getMyReports } from '../../../services/reportApi'
import { Card, EmptyState, PageHeader, Select, SkeletonBlock, StatusBadge } from '../../../components/ui'

const formatDate = (value) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not provided'
  return date.toLocaleString()
}

const targetLabel = (report) => {
  if (report?.relatedOrder) return `Order #${report?.relatedOrder?.id || 'Not provided'}`
  if (report?.relatedProductListing) {
    return report?.relatedProductListing?.name || `Listing #${report?.relatedProductListing?.id || 'Not provided'}`
  }
  if (report?.relatedShipment) {
    return report?.relatedShipment?.tracking_number || `Shipment #${report?.relatedShipment?.id || 'Not provided'}`
  }
  if (report?.relatedPayment) return `Payment #${report?.relatedPayment?.id || 'Not provided'}`
  if (report?.reportedUser) return report?.reportedUser?.name || report?.reportedUser?.email || 'Not provided'
  return 'General report'
}

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        setReports(await getMyReports())
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load reports.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredReports = useMemo(
    () => reports.filter((report) => !statusFilter || report?.status === statusFilter),
    [reports, statusFilter],
  )

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Reports"
        title="My reports"
        description="Track reports you submitted to Ministry/Admin for review."
        meta={[
          { label: 'Submitted', value: reports.length },
          { label: 'Visible', value: filteredReports.length },
        ]}
      />

      <Card className="p-5 md:p-6">
        <div className="max-w-xs">
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>
        {error ? (
          <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        ) : null}
      </Card>

      {loading ? (
        <div className="grid gap-4">
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
        </div>
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={FiFlag}
          title="No reports found"
          description="Reports you submit from order, product, or delivery pages will appear here."
        />
      ) : (
        <div className="grid gap-3">
          {filteredReports.map((report) => (
            <Card key={report?.id} className="p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {report?.category || 'general'} - {targetLabel(report)}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{report?.reason || 'Not provided'}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{report?.description || 'Not provided'}</p>
                  {report?.adminNotes ? (
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Admin notes: {report?.adminNotes || 'Not provided'}
                    </p>
                  ) : null}
                </div>
                <div className="shrink-0 space-y-2 md:text-right">
                  <StatusBadge status={report?.status} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(report?.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
