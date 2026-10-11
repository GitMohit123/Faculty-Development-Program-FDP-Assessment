export function getStudentWriteError(error, mongoose) {
  if (error.code === 11000) {
    return { status: 409, message: "A student with this email already exists" };
  }

  if (error instanceof mongoose.Error.ValidationError || error.name === "ValidationError") {
    return { status: 400, message: error.message };
  }

  if (error.name === "CastError") {
    return { status: 400, message: "Invalid student data" };
  }

  return { status: 500, message: "Unable to save student" };
}