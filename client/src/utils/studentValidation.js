export function validateStudent(student) {
  if (!student.name.trim() || !student.email.trim() || !student.course.trim()) {
    return 'Name, email, and course are required.'
  }

  if (!EMAIL_PATTERN.test(student.email.trim())) {
    return 'Enter a valid email address.'
  }

  return ''
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_STATUSES = ['Applied', 'Interview', 'Offered', 'Placed']

// Per-field messages for the form. otherStudents is used to catch an email
// that's already taken by a different record.
export function getStudentErrors(student, otherStudents = []) {
  const errors = {}
  const name = (student.name ?? '').trim()
  const email = (student.email ?? '').trim().toLowerCase()
  const course = (student.course ?? '').trim()

  if (!name) errors.name = 'Student name is required.'

  if (!email) {
    errors.email = 'Email address is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address, e.g. name@college.edu.'
  } else if (otherStudents.some((other) => other.email?.toLowerCase() === email)) {
    errors.email = 'Another student is already using this email.'
  }

  if (!course) errors.course = 'Course is required.'

  if (!student.status) {
    errors.status = 'Select a placement status.'
  } else if (!VALID_STATUSES.includes(student.status)) {
    errors.status = 'Select a valid placement status.'
  }

  return errors
}