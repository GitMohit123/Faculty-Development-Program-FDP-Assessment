const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed with status ${response.status}`)
  }

  return payload.data
}

export async function fetchStudents(search = '', status = 'All statuses') {
  const query = new URLSearchParams({ limit: '100' })
  if (search.trim()) query.set('q', search.trim())
  if (status !== 'All statuses') query.set('status', status)
  return request(`/students?${query}`)
}

export async function createStudent(student) {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  })
}

export async function updateStudent(id, student) {
  return request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  })
}
