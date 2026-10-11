export const STATUS_OPTIONS = ['Applied', 'Interview', 'Offered', 'Placed']

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const text = (value) => String(value ?? '').trim()
export function validateStudentFields(student, existingStudents = [], editingId = null) {
  const errors = {}

  if (!text(student.name)) errors.name = 'Name is required.'
  if (!text(student.course)) errors.course = 'Course is required.'

  const email = text(student.email).toLowerCase()
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  } else {
    const duplicate = existingStudents.some(
      (s) => String(s.email ?? '').trim().toLowerCase() === email && (s._id ?? s.id) !== editingId
    )
    if (duplicate) errors.email = 'A student with this email already exists.'
  }

  if (student.status !== undefined) {
    if (!text(student.status)) {
      errors.status = 'Placement status is required.'
    } else if (!STATUS_OPTIONS.includes(student.status)) {
      errors.status = 'Choose a valid placement status.'
    }
  }

  return errors
}
export function validateStudent(student, existingStudents = [], editingId = null) {
  const errors = validateStudentFields(student, existingStudents, editingId)
  const required = Object.values(errors).find((m) => /required/i.test(m))
  return required ?? Object.values(errors)[0] ?? ''
}