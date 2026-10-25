export function getStudentWriteError(error, mongoose) {
  if (error.code === 11000) {
    return {
      status: 409,
      message: "A student with this email already exists",
    };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map(
      (fieldError) => fieldError.message
    );

    return {
      status: 400,
      message: messages.join(", ") || "Invalid student data",
    };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      status: 400,
      message: "Invalid student data",
    };
  }

  return {
    status: 500,
    message: "Unable to save student",
  };
}