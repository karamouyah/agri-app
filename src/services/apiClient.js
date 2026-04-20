const DEFAULT_DEV_API_BASE_URL = 'http://127.0.0.1:8000/api'

const normalizeBaseUrl = (value) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed.replace(/\/+$/, '') : ''
}

const API_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) ||
  (import.meta.env.DEV ? DEFAULT_DEV_API_BASE_URL : '/_/backend/api')

const TOKENS_KEY = 'agri_auth_tokens'

export const getStoredTokens = () => {
  const raw = localStorage.getItem(TOKENS_KEY)
  return raw ? JSON.parse(raw) : null
}

export const setStoredTokens = (tokens) => {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

export const clearStoredTokens = () => {
  localStorage.removeItem(TOKENS_KEY)
}

const extractErrorMessage = (payload) => {
  if (!payload) return null
  if (typeof payload === 'string') return payload
  if (payload.detail && typeof payload.detail === 'string') return payload.detail
  if (payload.message && typeof payload.message === 'string') return payload.message

  if (Array.isArray(payload.non_field_errors) && payload.non_field_errors.length > 0) {
    return String(payload.non_field_errors[0])
  }

  if (Array.isArray(payload) && payload.length > 0) {
    return String(payload[0])
  }

  if (typeof payload === 'object') {
    const firstKey = Object.keys(payload)[0]
    const firstValue = payload[firstKey]

    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return String(firstValue[0])
    }

    if (typeof firstValue === 'string') {
      return firstValue
    }
  }

  return null
}

const buildHeaders = (headers = {}, hasBody = false) => {
  const merged = { ...headers }
  const tokens = getStoredTokens()

  if (tokens?.access) {
    merged.Authorization = `Bearer ${tokens.access}`
  }

  if (hasBody && !merged['Content-Type']) {
    merged['Content-Type'] = 'application/json'
  }

  return merged
}

const getApiUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL is not configured. Set it in Vercel before using the production build.',
    )
  }

  return `${API_BASE_URL}${path}`
}

export const apiRequest = async (path, options = {}) => {
  const method = options.method || 'GET'
  const hasBody = options.body !== undefined
  let response

  try {
    response = await fetch(getApiUrl(path), {
      ...options,
      method,
      headers: buildHeaders(options.headers, hasBody),
      body: hasBody && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('VITE_API_BASE_URL')) {
      throw error
    }

    throw new Error(
      import.meta.env.DEV
        ? `Cannot reach backend API at ${API_BASE_URL}. Start Django server and verify CORS/URL settings.`
        : `Cannot reach backend API at ${API_BASE_URL}. Verify the deployed API URL and backend CORS settings.`,
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = extractErrorMessage(payload) || `Request failed (${response.status}).`
    throw new Error(message)
  }

  return payload
}
