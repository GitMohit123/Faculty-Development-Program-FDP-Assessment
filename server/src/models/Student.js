import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Student name cannot be longer than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be a valid email address"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      maxlength: [100, "Course cannot be longer than 100 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Applied", "Interview", "Offered", "Placed"],
        message: "Status must be one of: Applied, Interview, Offered, Placed",
      },
      default: "Applied",
      required: [true, "Placement status is required"],
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;