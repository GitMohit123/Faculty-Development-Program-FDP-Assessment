
export function filterStudents(students, search, status) {
  const normalizedSearch = search.trim().toLowerCase();

  return students.filter((student) => {
    const name = (student.name ?? '').toLowerCase();
    const email = (student.email ?? '').toLowerCase();

    const matchesSearch =
      name.includes(normalizedSearch) ||
      email.includes(normalizedSearch);

    const matchesStatus =
      status === 'All statuses' || student.status === status;

    return matchesSearch && matchesStatus;
  });
}
