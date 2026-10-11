export const filterStudents = (studentsRecord, search, status) => {
  // trimed to remove spaces
  const searchTerm = search.trim().toLowerCase();
  const statusFilter = status.trim();

  return studentsRecord.filter((student) => {
    const name = student.name.toLowerCase();
    const email = student.email.toLowerCase();

    // for email and name
    const matchedSearch =
      searchTerm === '' ||
      name.includes(searchTerm) ||
      email.includes(searchTerm);

    // for status
    const matchedStatus =
      statusFilter === '' ||
      statusFilter === 'All statuses' || // this will return all statusRecords
      student.status === statusFilter;

    return matchedSearch && matchedStatus;
  });
};
