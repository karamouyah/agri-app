// File responsibility: Small formatting helpers shared by transporter mission UI.

export const fallback = (value, label = 'Not provided') => value || label

export const formatDate = (value) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatDateTime = (value) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const locationLine = (commune, wilaya) => {
  if (commune && wilaya) return `${commune}, ${wilaya}`
  if (wilaya) return wilaya
  if (commune) return commune
  return 'Location not provided'
}
