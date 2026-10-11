import { Router } from "express";
import { createStudent, listStudents, updateStudent } from "../controllers/studentController.js";

const router = Router();

router.get("/", listStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);


export default router;