export function filterStudents(students, search, status) {
  const searchTerm = (search ?? "").trim().toLowerCase();
  const selectedStatus = (status ?? "").trim().toLowerCase();

  return students.filter((student) => {
    const name = (student.name ?? "").toLowerCase();
    const email = (student.email ?? "").toLowerCase();
    const studentStatus = (student.status ?? "").toLowerCase();

    const matchesSearch =
      !searchTerm || name.includes(searchTerm) || email.includes(searchTerm);

    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "all" ||
      studentStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });
}
