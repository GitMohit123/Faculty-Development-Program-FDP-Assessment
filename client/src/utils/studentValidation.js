const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudentFields(
  student,
  students = [],
  editingId = null,
) {
  const errors = {};

  const name = (student.name ?? "").trim();
  const email = (student.email ?? "").trim().toLowerCase();
  const course = (student.course ?? "").trim();
  const status = (student.status ?? "").trim();

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  } else {
    const duplicate = students.some((existing) => {
      const existingId = existing._id ?? existing.id;
      const currentEmail = (existing.email ?? "").trim().toLowerCase();

      return currentEmail === email && existingId !== editingId;
    });

    if (duplicate) {
      errors.email = "A student with this email already exists.";
    }
  }

  if (!course) {
    errors.course = "Course is required.";
  }

  if (!status) {
    errors.status = "Placement status is required.";
  }

  return errors;
}

export function validateStudent(student, students = [], editingId = null) {
  const errors = validateStudentFields(student, students, editingId);
  return Object.values(errors)[0] ?? "";
}
