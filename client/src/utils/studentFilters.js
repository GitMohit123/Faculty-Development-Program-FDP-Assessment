const ALL_STATUSES = 'All statuses'

export function filterStudents(students, search, status) {
  const term = (search ?? '').trim().toLowerCase()
  const showAllStatuses = !status || status === ALL_STATUSES

  return students.filter((student) => {
    if (!showAllStatuses && student.status !== status) return false
    if (!term) return true

    const name = (student.name ?? '').toLowerCase()
    const email = (student.email ?? '').toLowerCase()
    return name.includes(term) || email.includes(term)
  })
}
