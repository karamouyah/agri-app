import { apiRequest } from './apiClient'

const normalizeUser = (user) => ({
  id: user?.id ?? null,
  name: user?.name || '',
  email: user?.email || '',
  role: user?.role || '',
  approvalStatus: user?.approval_status || '',
})

export const normalizeDocument = (document) => ({
  id: document?.id ?? null,
  user: normalizeUser(document?.user),
  role: document?.role || '',
  documentType: document?.document_type || '',
  fileUrl: document?.file_url || '',
  fileName: document?.file_name || '',
  status: document?.status || 'pending',
  adminNotes: document?.admin_notes || '',
  createdAt: document?.created_at || '',
  updatedAt: document?.updated_at || '',
})

export const uploadDocument = async ({ documentType, file }) => {
  const formData = new FormData()
  formData.append('document_type', documentType)
  formData.append('file', file)

  const document = await apiRequest('/documents/upload/', {
    method: 'POST',
    body: formData,
  })
  return normalizeDocument(document)
}

export const getMyDocuments = async () => {
  const documents = await apiRequest('/documents/mine/')
  return Array.isArray(documents) ? documents.map(normalizeDocument) : []
}

export const getAdminDocuments = async () => {
  const documents = await apiRequest('/documents/admin/')
  return Array.isArray(documents) ? documents.map(normalizeDocument) : []
}

export const updateAdminDocument = async (id, payload) => {
  const document = await apiRequest(`/documents/admin/${id}/`, {
    method: 'PATCH',
    body: {
      status: payload.status,
      admin_notes: payload.adminNotes,
    },
  })
  return normalizeDocument(document)
}
