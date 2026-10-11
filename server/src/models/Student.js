import mongoose from 'mongoose';
import validator from 'validator';

const PLACEMENT_STATUSES = ['Applied', 'Interview', 'Offered', 'Placed'];

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email address'], //
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: PLACEMENT_STATUSES, // In one Const Field
        message:
          'Placement status must be Applied, Interview, Offered, or Placed',
      },
      default: 'Applied',
      required: [true, 'Placement status is required'],
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
