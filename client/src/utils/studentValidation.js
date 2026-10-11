export function validateStudent(student) {
  if (!student.name.trim() && !student.email.trim() && !student.course.trim())
    return "EVERY FIELD IS REQUIRED";

  if (!student.name.trim()) {
    return "Name is required";
  } else if (!student.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const isValid = emailRegex.test(student.email);
      console.log(isValid);

      if (!isValid) {
        return "Type Email,Use correct format";
      }
    
  } else if (!student.course.trim()) {
    return "Course is required";
  } else if (!student.status.trim()) {
    return "Status is required";
  }

  // Challenge 2: add email-format and duplicate-email validation.
}
