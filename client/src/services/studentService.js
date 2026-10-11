const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function requestPayload(path, options) {
  let response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (networkError) {
    if (networkError.name === 'AbortError') throw networkError
    throw new Error('Could not reach the server. Check that the API is running and try again.', { cause: networkError })
  }
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || `Request failed with status ${response.status}`)
    error.status = response.status
    error.fieldErrors = payload.errors
    throw error
  }

  return payload
}

async function request(path, options) {
  const payload = await requestPayload(path, options)
  // console.log(payload)
  
  
  return payload.data
}

export async function fetchStudents() {
  return request('/students')
}



async function topreventdataloss(){
  console.log("function is running ")

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

// One page of students with search/status applied on the server.
export async function fetchStudentPage({ search = '', status = '', page = 1, pageSize = 10, signal } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (search) params.set('q', search)
  if (status && status !== 'All statuses') params.set('status', status)

  const payload = await requestPayload(`/students?${params}`, { signal })
  return { students: payload.data ?? [], pagination: payload.pagination }
}

// The summary cards need totals across every record, not just the page on screen,
// so ask for one record per status and read the total off the pagination info.
export async function fetchStudentSummary(signal) {
  const countFor = async (status) => {
    const { pagination } = await fetchStudentPage({ status, pageSize: 1, signal })
    return pagination?.total ?? 0
  }

  const [total, placed, offered] = await Promise.all([countFor(''), countFor('Placed'), countFor('Offered')])
  return { total, placed, offered }
}

