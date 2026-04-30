import { useEffect, useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { createReport } from '../services/reportApi'
import { Card, FormField, Select, Textarea, Input, buttonStyles, cn } from './ui'

const categoryOptions = [
  ['user', 'User'],
  ['order', 'Order'],
  ['product', 'Product or listing'],
  ['shipment', 'Delivery or shipment'],
  ['payment', 'Payment or transaction'],
  ['other', 'Other'],
]

export default function ReportModal({ open, onClose, target = {}, title = 'Submit report' }) {
  const [category, setCategory] = useState(target?.category || '')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setCategory(target?.category || '')
    setReason('')
    setDescription('')
    setError('')
    setSuccess('')
  }, [open, target?.category])

  if (!open) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await createReport({
        ...target,
        category,
        reason: reason.trim(),
        description: description.trim(),
      })
      setSuccess('Report submitted for ministry review.')
      setReason('')
      setDescription('')
      setTimeout(() => {
        setSuccess('')
        onClose?.()
      }, 900)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            <FiAlertTriangle />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Reports are text-only in this first version and are reviewed by Ministry/Admin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <FormField label="Category">
            <Select value={category} onChange={(event) => setCategory(event.target.value)} required>
              <option value="">Select category</option>
              {categoryOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Reason">
            <Input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={160}
              placeholder="Short reason"
              required
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="Describe what happened clearly."
              required
            />
          </FormField>

          {target?.label ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
              Related to: {target?.label || 'Not provided'}
            </p>
          ) : null}

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
            <button type="submit" className={cn(buttonStyles.primary, 'bg-amber-600 hover:bg-amber-700')} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
