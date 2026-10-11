export function getStudentWriteError(error, mongoose) {
  if (error.code === 11000) {
    return { status: 409, message: "A student with this email already exists" };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((e) => e.message);
    return { status: 400, message: details.join(", ") };
  }

  if (error instanceof mongoose.Error.CastError) {
    return { status: 400, message: `Invalid value for ${error.path}` };
  }

  return { status: 500, message: "Unable to save student" };
}