// File responsibility: Holds small frontend helper functions used by routes, formatting, or display logic.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

export const PLATFORM_CURRENCY = 'DZD'

const DZD_FORMATTER = new Intl.NumberFormat('en-DZ', {
  maximumFractionDigits: 0,
})

// normalizeAmount handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const normalizeAmount = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return 0
  }
  return Math.round(numeric)
}

// formatDzd handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const formatDzd = (value) => `${DZD_FORMATTER.format(normalizeAmount(value))} ${PLATFORM_CURRENCY}`

// formatDzdPerUnit handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const formatDzdPerUnit = (value, unit = 'kg') => `${formatDzd(value)} / ${unit}`

// formatDzdRange handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const formatDzdRange = (minValue, maxValue, unit = '') => {
  const unitSuffix = unit ? ` / ${unit}` : ''
  return `${formatDzd(minValue)} - ${formatDzd(maxValue)}${unitSuffix}`
}
