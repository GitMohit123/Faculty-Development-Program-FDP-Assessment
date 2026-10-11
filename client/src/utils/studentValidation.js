export function validateStudent(student, field) {
  // Challenge 2: add email-format and duplicate-email validation.
  const errors = {
    name: student.name?.trim() ? '' : 'Student name is required.',
    email: !student.email?.trim()
      ? 'Email address is required.'
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email.trim())
        ? ''
        : 'Enter a valid email address.',
    course: student.course?.trim() ? '' : 'Course is required.',
    status: student.status === undefined || student.status?.trim() ? '' : 'Placement status is required.',
  }

  return field ? errors[field] : Object.values(errors).find(Boolean) ?? ''
}
