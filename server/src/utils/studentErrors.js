export function getStudentWriteError(error, mongoose) {
  if (error.code === 11000) {
    return { status: 409, message: "A student with this email already exists" };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    // only send back the messages we wrote in the schema, not mongoose's full error text
    const errors = {};
    for (const [field, fieldError] of Object.entries(error.errors)) {
      errors[field] = fieldError instanceof mongoose.Error.CastError
        ? `${field} has an invalid value`
        : fieldError.message;
    }
    return { status: 400, message: Object.values(errors).join(". "), errors };
  }

  if (error instanceof mongoose.Error.CastError) {
    return { status: 400, message: `${error.path} has an invalid value` };
  }

  return { status: 500, message: "Unable to save student" };
}
