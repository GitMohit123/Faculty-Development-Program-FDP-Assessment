import mongoose from "mongoose";
import Student from "../models/Student.js";
import { buildStudentQuery } from "../utils/studentQuery.js";
import { getStudentWriteError } from "../utils/studentErrors.js";

function sendWriteError(error, res) {
  const result = getStudentWriteError(error, mongoose);
  return res.status(result.status).json({ success: false, message: result.message });
}

export async function listStudents(req, res) {
  try {
    const { filter, page, pageSize } = buildStudentQuery(req.query);
    const databaseFilter = { ...filter };
    if (databaseFilter.search) {
      const search = databaseFilter.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      delete databaseFilter.search;
      databaseFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const [students, total] = await Promise.all([
      Student.find(databaseFilter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize),
      Student.countDocuments(databaseFilter),
    ]);
    return res.status(200).json({
      success: true,
      data: students,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    return res.status(error instanceof URIError ? 400 : 500).json({
      success: false,
      message: error instanceof URIError ? error.message : "Unable to load students",
    });
  }
}

export async function createStudent(req, res) {
  try {
    const student = await Student.create(req.body);
    return res.status(201).json({ success: true, data: student });
  } catch (error) {
    return sendWriteError(error, res);
  }
}

export async function updateStudent(req, res) {
  try {
    // Challenge 4: validate the ObjectId and enable update validators before saving.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return sendWriteError(error, res);
  }
}
