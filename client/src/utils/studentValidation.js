const validStatuses = ['Applied', 'Interview', 'Offered', 'Placed']

export function getStudentFieldErrors(student) {
  const values = {
    name: String(student?.name ?? '').trim(),
    email: String(student?.email ?? '').trim(),
    course: String(student?.course ?? '').trim(),
    status: String(student?.status ?? '').trim(),
  }

  const errors = {}

  if (!values.name) {
    errors.name = 'Name is required.'
  }

  if (!values.email) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.course) {
    errors.course = 'Course is required.'
  }

  if (student && Object.hasOwn(student, 'status') && values.status && !validStatuses.includes(values.status)) {
    errors.status = 'Please select a valid placement status.'
  }

  return errors
}

export function validateStudent(student) {
  const fieldErrors = getStudentFieldErrors(student)
  return Object.values(fieldErrors)[0] ?? ''
}