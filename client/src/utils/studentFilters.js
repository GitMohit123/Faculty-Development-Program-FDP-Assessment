export function filterStudents(students, search, status) {
  const normalizedSearch = String(search ?? '').trim().toLowerCase()
  const normalizedStatus = status ?? 'All statuses'

  return students.filter((student) => {
    const matchesSearch = !normalizedSearch ||
      [student?.name, student?.email].some((value) =>
        String(value ?? '').toLowerCase().includes(normalizedSearch),
      )

    const matchesStatus = normalizedStatus === 'All statuses' ||
      student?.status === normalizedStatus

    return matchesSearch && matchesStatus
  })
}