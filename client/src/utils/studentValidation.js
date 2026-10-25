
const validStatuses = ['Applied', 'Interview', 'Offered', 'Placed']

export function validateStudent(student) {
  const errors = {}

  if (!student.name.trim()) {
    errors.name = 'Student name is required.'
  }

  if (!student.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!student.course.trim()) {
    errors.course = 'Course is required.'
  }

  if (!validStatuses.includes(student.status)) {
    errors.status = 'Please select a placement status.'
  }

  return errors
}
