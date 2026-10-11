import mongoose from "mongoose";
import Student from "../models/Student.js";
import { buildStudentQuery } from "../utils/studentQuery.js";
import { getStudentWriteError } from "../utils/studentErrors.js";

function sendWriteError(error, res) {
  const result = getStudentWriteError(error, mongoose);
  return res.status(result.status).json({ success: false, message: result.message });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listStudents(req, res) {
  try {
    const { filter, page, pageSize } = buildStudentQuery(req.query);
    const mongoFilter = {};

    if (filter.status) {
      mongoFilter.status = filter.status;
    }

    if (filter.search) {
      mongoFilter.$or = [
        { name: { $regex: escapeRegex(filter.search), $options: "i" } },
        { email: { $regex: escapeRegex(filter.search), $options: "i" } },
      ];
    }

    const [students, total] = await Promise.all([
      Student.find(mongoFilter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize),
      Student.countDocuments(mongoFilter),
    ]);

    return res.status(200).json({
      success: true,
      data: students,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load students" });
  }
}

export async function createStudent(req, res) {
  try {
    const { name, email, course, status } = req.body;

    if (!name || !email || !course) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and course are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const validStatuses = ["Applied", "Interview", "Offered", "Placed"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
      });
    }

    const payload = {
      ...req.body,
      name: String(name).trim(),
      email: normalizedEmail,
      course: String(course).trim(),
    };

    const student = new Student(payload);
    await student.validate();

    const createdStudent = await Student.create(payload);
    return res.status(201).json({ success: true, data: createdStudent });
  } catch (error) {
    return sendWriteError(error, res);
  }
}
export async function updateStudent(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid student id" });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return sendWriteError(error, res);
  }
}