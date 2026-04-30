import { useEffect, useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi'
import { uploadDocument } from '../services/documentApi'
import { Card, FormField, Input, Select, buttonStyles, cn } from './ui'

const documentTypes = [
  ['ID_CARD', 'ID card'],
  ['LICENSE', 'License'],
  ['OTHER', 'Other'],
]

export default function DocumentUploadModal({ open, onClose, onUploaded }) {
  const [documentType, setDocumentType] = useState('ID_CARD')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setDocumentType('ID_CARD')
    setFile(null)
    setError('')
    setSuccess('')
  }, [open])

  if (!open) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!file) {
      setError('Select a document file first.')
      return
    }

    setSubmitting(true)
    try {
      const uploaded = await uploadDocument({ documentType, file })
      setSuccess('Document uploaded for ministry review.')
      onUploaded?.(uploaded)
      setTimeout(() => {
        onClose?.()
      }, 800)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload document.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <FiUploadCloud />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upload verification document</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Upload a JPG, PNG, WEBP, or PDF file. Maximum size is 5 MB.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <FormField label="Document Type">
            <Select value={documentType} onChange={(event) => setDocumentType(event.target.value)} required>
              {documentTypes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="File">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              required
            />
          </FormField>

          {error ? (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              {success}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onClose} className={buttonStyles.secondary} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className={cn(buttonStyles.primary)} disabled={submitting}>
              {submitting ? 'Uploading...' : 'Upload Documents'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
