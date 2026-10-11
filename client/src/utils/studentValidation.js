const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns an object with one message per invalid field, e.g.
 * { name: 'Student name is required.', email: 'Enter a valid email address.' }
 * Valid fields are simply omitted from the object.
 */
export function validateStudentFields(student) {
  const values = {
    name: student?.name ?? '',
    email: student?.email ?? '',
    course: student?.course ?? '',
    status: student?.status ?? '',
  };

  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Student name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.course.trim()) {
    errors.course = 'Course is required.';
  }

  if ('status' in (student ?? {}) && !values.status.trim()) {
    errors.status = 'Placement status is required.';
  }

  // Challenge 2: add duplicate-email validation when the existing list is available.
  return errors;
}

export function validateStudent(student) {
  const messages = Object.values(validateStudentFields(student));
  return messages.join(' ');
}
