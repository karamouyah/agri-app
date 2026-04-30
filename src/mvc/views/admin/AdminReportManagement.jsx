import { useEffect, useMemo, useState } from 'react'
import { FiFlag, FiSearch } from 'react-icons/fi'
import { getAdminReports, updateAdminReport } from '../../../services/reportApi'
import { Card, EmptyState, Input, PageHeader, Select, StatusBadge, Textarea, buttonStyles } from '../../../components/ui'

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

const reportSearchText = (report) =>
  [
    report.id,
    report?.reason,
    report?.description,
    report?.category,
    report?.status,
    report?.reporter?.name,
    report?.reporter?.email,
    report?.reportedUser?.name,
    report?.reportedUser?.email,
    targetLabel(report),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

export default function AdminReportManagement() {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setReports(await getAdminReports())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load reports.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase()
    return reports.filter((report) => {
      const matchesSearch = !query || reportSearchText(report).includes(query)
      const matchesStatus = !statusFilter || report?.status === statusFilter
      const matchesCategory = !categoryFilter || report?.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [reports, search, statusFilter, categoryFilter])

  const handleSave = async () => {
    if (!selectedReport) return
    setSaving(true)
    setError('')
    try {
      const updated = await updateAdminReport(selectedReport?.id, selectedReport)
      setReports((prev) => prev.map((report) => (report?.id === updated?.id ? updated : report)))
      setSelectedReport(updated)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update report.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Signalements"
        title="Manage user reports"
        description="Review text-only reports, update their status, and add internal ministry notes."
        meta={[
          { label: 'Reports', value: reports.length },
          { label: 'Visible', value: filteredReports.length },
        ]}
      />

      <Card className="p-5 md:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <label className="relative block">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reporter, reason, target..."
              className="pl-11"
            />
          </label>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All categories</option>
            <option value="user">User</option>
            <option value="order">Order</option>
            <option value="product">Product</option>
            <option value="shipment">Shipment</option>
            <option value="payment">Payment</option>
            <option value="other">Other</option>
          </Select>
          <button type="button" onClick={load} className={buttonStyles.secondary}>
            Refresh
          </button>
        </div>
        {error ? (
          <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        ) : null}
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-slate-600 dark:text-slate-300">Loading reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={FiFlag} title="No reports found" description="No reports match the current filters." />
            </div>
          ) : (
            <div className="table-shell m-5 md:m-6">
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Report</th>
                      <th>Reporter</th>
                      <th>Target</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report?.id}>
                        <td>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{report?.reason || 'Not provided'}</p>
                          <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{report?.category || 'general'}</p>
                        </td>
                        <td>{report?.reporter?.name || report?.reporter?.email || 'Not provided'}</td>
                        <td>{targetLabel(report)}</td>
                        <td><StatusBadge status={report?.status} /></td>
                        <td>{formatDate(report?.createdAt)}</td>
                        <td>
                          <button type="button" onClick={() => setSelectedReport(report)} className={buttonStyles.secondary}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>

        <Card className="h-fit p-5 md:p-6">
          {selectedReport ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Report #{selectedReport?.id || 'Not provided'}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedReport?.reason || 'Not provided'}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedReport?.description || 'Not provided'}</p>
              </div>
              <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200">
                <p><span className="font-medium">Reporter:</span> {selectedReport?.reporter?.name || selectedReport?.reporter?.email || 'Not provided'}</p>
                <p><span className="font-medium">Target:</span> {targetLabel(selectedReport)}</p>
                <p><span className="font-medium">Created:</span> {formatDate(selectedReport?.createdAt)}</p>
              </div>
              <Select
                value={selectedReport?.status || 'pending'}
                onChange={(event) => setSelectedReport((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </Select>
              <Textarea
                rows={6}
                value={selectedReport?.adminNotes || ''}
                onChange={(event) => setSelectedReport((prev) => ({ ...prev, adminNotes: event.target.value }))}
                placeholder="Internal admin notes..."
              />
              <button type="button" onClick={handleSave} disabled={saving} className={buttonStyles.primary}>
                Save Review
              </button>
            </div>
          ) : (
            <EmptyState icon={FiFlag} title="Select a report" description="Open a report to update status or add admin notes." />
          )}
        </Card>
      </div>
    </section>
  )
}
