export const DUPLICATE_EMAIL_MESSAGE = "A student with this email already exists";

export function getStudentWriteError(error, mongoose) {
  if (error.code === 11000) {
    return { status: 409, message: DUPLICATE_EMAIL_MESSAGE };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((detail) => detail.message);
    return { status: 400, message: messages.join(" ") || "Invalid student data" };
  }

  if (error instanceof mongoose.Error.CastError) {
    const message = error.path === "_id" ? "Malformed student id" : "Invalid student data";
    return { status: 400, message };
  }

  // Anything unexpected is logged on the server only, so the response never
  // carries stack traces, query strings, or driver details.
  return { status: 500, message: "Unable to save student" };
}
