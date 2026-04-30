import { useEffect, useState } from 'react'
import { FiFileText, FiUploadCloud } from 'react-icons/fi'
import DocumentUploadModal from '../../../components/DocumentUploadModal'
import { Card, EmptyState, PageHeader, StatusBadge, buttonStyles } from '../../../components/ui'
import { getMyDocuments } from '../../../services/documentApi'

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

export default function MyDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setDocuments(await getMyDocuments())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load documents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Verification"
        title="My documents"
        description="Upload identity or license documents for ministry review."
        actions={
          <button type="button" onClick={() => setUploadOpen(true)} className={buttonStyles.primary}>
            <FiUploadCloud />
            Upload Documents
          </button>
        }
        meta={[
          { label: 'Submitted', value: documents.length },
          { label: 'Pending', value: documents.filter((document) => document?.status === 'pending').length },
        ]}
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="p-5 text-sm text-slate-600 dark:text-slate-300">Loading documents...</Card>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No documents uploaded"
          description="Upload your first verification document so ministry staff can review it."
          action={{ label: 'Upload Documents', onClick: () => setUploadOpen(true) }}
        />
      ) : (
        <div className="grid gap-3">
          {documents.map((document) => (
            <Card key={document?.id} className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  {isImageFile(document) && document?.fileUrl ? (
                    <img src={document.fileUrl} alt={document?.fileName || 'Document'} className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      <FiFileText />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {documentTypeLabel[document?.documentType] || 'Document'}
                    </h3>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{document?.fileName || 'File not provided'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded {formatDate(document?.createdAt)}</p>
                    {document?.adminNotes ? (
                      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Admin notes: {document.adminNotes}
                      </p>
                    ) : null}
                  </div>
                </div>
                <StatusBadge status={document?.status || 'pending'} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(document) => setDocuments((prev) => [document, ...prev])}
      />
    </section>
  )
}
