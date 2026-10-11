export function filterStudents(students, search = '', status = 'All') {
  const term = String(search ?? '').trim().toLowerCase()
  const hasStatus = status && status !== 'All'

  return students.filter((student) => {
    const matchesSearch =
      !term ||
      String(student.name ?? '').toLowerCase().includes(term) ||
      String(student.email ?? '').toLowerCase().includes(term)

    const matchesStatus = !hasStatus || student.status === status

    return matchesSearch && matchesStatus
  })
}