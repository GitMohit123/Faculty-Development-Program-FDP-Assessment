import mongoose from "mongoose";
import Student from "../models/Student.js";
import { buildStudentQuery } from "../utils/studentQuery.js";
import { DUPLICATE_EMAIL_MESSAGE, getStudentWriteError } from "../utils/studentErrors.js";

const STUDENT_FIELDS = ["name", "email", "course", "status"];

function sendJson(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function sendWriteError(error, res) {
  const result = getStudentWriteError(error, mongoose);
  return res.status(result.status).json({ success: false, message: result.message });
}

// Keeps only the student fields, trims them and lowercases the email so the
// value that is stored, searched and compared is always in the same shape.
function pickStudentFields(body) {
  const data = {};

  for (const field of STUDENT_FIELDS) {
    const value = body?.[field];
    if (value === undefined) continue;
    data[field] = typeof value === "string" ? value.trim() : value;
  }

  if (typeof data.email === "string") {
    data.email = data.email.toLowerCase();
  }

  return data;
}

async function emailTaken(email, excludedId) {
  const filter = { email };
  if (excludedId) {
    filter._id = { $ne: excludedId };
  }
  return Boolean(await Student.findOne(filter));
}

export async function listStudents(req, res) {
  try {
    const { filter, page, pageSize } = buildStudentQuery(req.query);
    const [students, total] = await Promise.all([
      Student.find(filter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize),
      Student.countDocuments(filter),
    ]);
    return res.status(200).json({
      success: true,
      data: students,
      pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch {
    return sendJson(res, 500, "Unable to load students");
  }
}

export async function createStudent(req, res) {
  try {
    const data = pickStudentFields(req.body);

    if (data.email && (await emailTaken(data.email))) {
      return sendJson(res, 409, DUPLICATE_EMAIL_MESSAGE);
    }

    const student = await Student.create(data);
    return res.status(201).json({ success: true, data: student });
  } catch (error) {
    return sendWriteError(error, res);
  }
}

export async function updateStudent(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendJson(res, 400, "Malformed student id");
    }

    const data = pickStudentFields(req.body);

    if (data.email && (await emailTaken(data.email, req.params.id))) {
      return sendJson(res, 409, DUPLICATE_EMAIL_MESSAGE);
    }

    // runValidators makes the schema rules apply to updates as well,
    // otherwise a bad status or empty name could be written straight through.
    const student = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!student) {
      return sendJson(res, 404, "Student not found");
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return sendWriteError(error, res);
  }
}
