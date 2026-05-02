// File responsibility: Reusable component for uploading verification documents
// Used by the React frontend for farmer, buyer, and transporter profiles

import { useState } from 'react'
import { FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi'
import { Card, Select, buttonStyles } from './ui'
import { apiRequest } from '../services/apiClient'

export default function DocumentUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [documentType, setDocumentType] = useState('ID_CARD')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be 5 MB or less')
        setFile(null)
        event.target.value = ''
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError('')
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', documentType)

      await apiRequest('/documents/upload/', {
        method: 'POST',
        body: formData,
      })

      setMessage('Document uploaded successfully')
      setFile(null)
      setDocumentType('ID_CARD')
      event.target.reset()
      if (onUploadSuccess) onUploadSuccess()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Upload Verification Document
      </h3>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Document Type
          </label>
          <Select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
            <option value="ID_CARD">ID Card</option>
            <option value="LICENSE">License</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            File (JPG, PNG, WEBP, or PDF - Max 5MB)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          />
          {file && (
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <FiFile /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <button type="submit" disabled={uploading || !file} className={buttonStyles.primary}>
          <span className="inline-flex items-center gap-2">
            <FiUpload />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </span>
        </button>

        {message && (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            <FiCheck /> {message}
          </p>
        )}
        {error && (
          <p className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            <FiX /> {error}
          </p>
        )}
      </form>
    </Card>
  )
}
