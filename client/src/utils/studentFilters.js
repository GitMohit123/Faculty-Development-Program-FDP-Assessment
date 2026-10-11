export function filterStudents(students, search, status) {
  const searchValue = search.trim().toLowerCase()

  return students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchValue)
      || student.email.toLowerCase().includes(searchValue)
    const matchesStatus = status === 'All statuses' || student.status === status

    return matchesSearch && matchesStatus
  })
}
