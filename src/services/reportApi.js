import { apiRequest } from './apiClient'

const normalizePerson = (person) => ({
  id: person?.id ?? null,
  name: person?.name || '',
  email: person?.email || '',
  role: person?.role || '',
})

export const normalizeReport = (report) => ({
  id: report?.id ?? null,
  reporter: normalizePerson(report?.reporter),
  reportedUser: report?.reported_user ? normalizePerson(report.reported_user) : null,
  relatedOrder: report?.related_order || null,
  relatedProductListing: report?.related_product_listing || null,
  relatedShipment: report?.related_shipment || null,
  relatedPayment: report?.related_payment || null,
  category: report?.category || '',
  reason: report?.reason || '',
  description: report?.description || '',
  status: report?.status || 'pending',
  adminNotes: report?.admin_notes || '',
  createdAt: report?.created_at || '',
  updatedAt: report?.updated_at || '',
})

export const createReport = async (payload) => {
  const report = await apiRequest('/reports/', {
    method: 'POST',
    body: {
      category: payload.category || '',
      reason: payload.reason,
      description: payload.description,
      reported_user_id: payload.reportedUserId || null,
      related_order_id: payload.relatedOrderId || null,
      related_product_listing_id: payload.relatedProductListingId || null,
      related_shipment_id: payload.relatedShipmentId || null,
      related_payment_id: payload.relatedPaymentId || null,
    },
  })
  return normalizeReport(report)
}

export const getMyReports = async () => {
  const reports = await apiRequest('/reports/mine/')
  return Array.isArray(reports) ? reports.map(normalizeReport) : []
}

export const getAdminReports = async () => {
  const reports = await apiRequest('/reports/admin/')
  return Array.isArray(reports) ? reports.map(normalizeReport) : []
}

export const updateAdminReport = async (id, payload) => {
  const report = await apiRequest(`/reports/admin/${id}/`, {
    method: 'PATCH',
    body: {
      status: payload.status,
      admin_notes: payload.adminNotes,
    },
  })
  return normalizeReport(report)
}
