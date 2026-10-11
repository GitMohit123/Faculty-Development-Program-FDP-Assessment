import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: { values: ["Applied", "Interview", "Offered", "Placed"], message: "Invalid placement status" },
      required: [true, "Placement status is required"],
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
