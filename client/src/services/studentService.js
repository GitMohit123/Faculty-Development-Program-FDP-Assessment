const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function requestPayload(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed with status ${response.status}`)
  }

  return payload
}

async function request(path, options) {
  const payload = await requestPayload(path, options)
  return payload.data
}

function buildQueryString({ search, status, page, limit } = {}) {
  const params = new URLSearchParams()
  if (search && search.trim()) params.set('search', search.trim())
  if (status && status !== 'All') params.set('status', status)
  if (page) params.set('page', String(page))
  if (limit) params.set('limit', String(limit))
  const query = params.toString()
  return query ? `?${query}` : ''
}

// Returns the records array only (backward compatible).
export async function fetchStudents(params = {}, { signal } = {}) {
  return request(`/students${buildQueryString(params)}`, { signal })
}

// Returns { data, pagination } for the paginated list UI.
export async function fetchStudentsPage(params = {}, { signal } = {}) {
  const payload = await requestPayload(`/students${buildQueryString(params)}`, { signal })
  return { data: payload.data, pagination: payload.pagination }
}

export async function createStudent(student) {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  })
}

export async function updateStudent(id, student) {
  return request(`/students/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  })
}