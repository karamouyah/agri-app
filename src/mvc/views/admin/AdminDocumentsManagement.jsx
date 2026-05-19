import { useEffect, useMemo, useState } from 'react'
import { FiFileText, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { Card, EmptyState, Input, PageHeader, Select, StatusBadge, Textarea, buttonStyles } from '../../../components/ui'
import { getAdminDocuments, updateAdminDocument } from '../../../services/documentApi'

const documentTypeLabel = {
  ID_CARD: 'ID card',
  LICENSE: 'License',
  OTHER: 'Other',
}

const formatDate = (value) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not provided'
  return date.toLocaleString()
}

const isImageFile = (document) => /\.(png|jpe?g|webp)$/i.test(document?.fileName || document?.fileUrl || '')

const searchText = (document) =>
  [
    document?.id,
    document?.user?.name,
    document?.user?.email,
    document?.role,
    document?.documentType,
    document?.status,
    document?.fileName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

export default function AdminDocumentsManagement() {
  const [documents, setDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setDocuments(await getAdminDocuments())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load verification documents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase()
    return documents.filter((document) => {
      const matchesSearch = !query || searchText(document).includes(query)
      const matchesStatus = !statusFilter || document?.status === statusFilter
      const matchesRole = !roleFilter || document?.role === roleFilter
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [documents, search, statusFilter, roleFilter])

  const handleSave = async () => {
    if (!selectedDocument) return
    setSaving(true)
    setError('')
    try {
      const updated = await updateAdminDocument(selectedDocument?.id, selectedDocument)
      setDocuments((prev) => prev.map((document) => (document?.id === updated?.id ? updated : document)))
      setSelectedDocument(updated)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update document.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Verification"
        title="Manage documents"
        description="Review buyer and transporter verification documents before approving accounts."
        meta={[
          { label: 'Documents', value: documents.length },
          { label: 'Visible', value: filteredDocuments.length },
        ]}
      />

      <Card className="p-5 md:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <label className="relative block">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search user, email, file..."
              className="pl-11"
            />
          </label>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="">All roles</option>
            <option value="buyer">Buyer</option>
            <option value="transporter">Transporter</option>
          </Select>
          <button type="button" onClick={load} className={buttonStyles.secondary}>
            <FiRefreshCw />
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
            <div className="p-6 text-sm text-slate-600 dark:text-slate-300">Loading documents...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={FiFileText} title="No documents found" description="No verification documents match the current filters." />
            </div>
          ) : (
            <div className="table-shell m-5 md:m-6">
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Preview</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((document) => (
                      <tr key={document?.id}>
                        <td>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{document?.user?.name || 'Not provided'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{document?.user?.email || 'Not provided'}</p>
                        </td>
                        <td className="capitalize">{document?.role || 'Not provided'}</td>
                        <td>{documentTypeLabel[document?.documentType] || 'Not provided'}</td>
                        <td>
                          {document?.fileUrl ? (
                            <a href={document.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
                              {isImageFile(document) ? 'Open image' : document?.fileName || 'Open file'}
                            </a>
                          ) : (
                            <span className="text-sm text-slate-500">Not provided</span>
                          )}
                        </td>
                        <td><StatusBadge status={document?.status || 'pending'} /></td>
                        <td>{formatDate(document?.createdAt)}</td>
                        <td>
                          <button type="button" onClick={() => setSelectedDocument(document)} className={buttonStyles.secondary}>
                            Review
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
          {selectedDocument ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Document #{selectedDocument?.id || 'Not provided'}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {documentTypeLabel[selectedDocument?.documentType] || 'Document'}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {selectedDocument?.user?.name || 'Not provided'} - {selectedDocument?.user?.email || 'Not provided'}
                </p>
              </div>

              {selectedDocument?.fileUrl ? (
                isImageFile(selectedDocument) ? (
                  <a href={selectedDocument.fileUrl} target="_blank" rel="noreferrer">
                    <img src={selectedDocument.fileUrl} alt={selectedDocument?.fileName || 'Document'} className="max-h-64 w-full rounded-lg object-contain bg-slate-50 dark:bg-slate-800" />
                  </a>
                ) : (
                  <a href={selectedDocument.fileUrl} target="_blank" rel="noreferrer" className={buttonStyles.secondary}>
                    Open PDF/File
                  </a>
                )
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">File not provided.</p>
              )}

              <Textarea
                rows={3}
                value={selectedDocument?.adminNotes || ''}
                onChange={(event) => setSelectedDocument((prev) => ({ ...prev, adminNotes: event.target.value }))}
                placeholder="Optional rejection reason or admin notes..."
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocument((prev) => ({ ...prev, status: 'approved' }))
                    handleSave()
                  }}
                  disabled={saving}
                  className="flex-1 py-2 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 backdrop-blur-md hover:bg-emerald-500/20 font-semibold transition-all"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocument((prev) => ({ ...prev, status: 'rejected' }))
                    handleSave()
                  }}
                  disabled={saving}
                  className="flex-1 py-2 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 backdrop-blur-md hover:bg-rose-500/20 font-semibold transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <EmptyState icon={FiFileText} title="Select a document" description="Open a document to approve, reject, or add notes." />
          )}
        </Card>
      </div>
    </section>
  )
}
