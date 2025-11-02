import express from "express";
import {
  createStudent,
  deleteStudent,
  getEachStudent,
  getStudentsList,
  updateStudent,
} from "../models/Student";
import { validateUniversitySchema } from "../middlewares/validateUniversitySchema";

const studentsRouter = express.Router();

studentsRouter.get("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;
    if (!schemaName) return;

    const result = await getStudentsList({ schemaName });

    if (result?.length === 0) {
      throw new Error("No students found");
    }

    res.json(result);
  } catch (error: any) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

studentsRouter.post("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const { name, age, email, phoneNumber, studentId, courseIds } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!email) {
      return res.status(400).json({ error: "Missing email" });
    } else if (!phoneNumber) {
      return res.status(400).json({ error: "Missing phoneNumber" });
    } else if (!studentId) {
      return res.status(400).json({ error: "Missing studentId" });
    }

    const result = await createStudent({
      schemaName,
      name,
      age,
      email,
      phoneNumber,
      studentId,
      courseIds,
    });

    res.status(201).json({
      data: result,
    });
  } catch (err: any) {
    console.error("Error inserting student:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

studentsRouter.get(
  "/:studentId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const studentId = req.params.studentId;
      if (!studentId) {
        return res.status(400).json({ error: "Missing studentId" });
      }

      const result = await getEachStudent({ id: studentId, schemaName });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching student:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

studentsRouter.put(
  "/:studentId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const studentId = req.params.studentId;
      const { name, age, email, phoneNumber, courseIds } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Missing name" });
      } else if (!email) {
        return res.status(400).json({ error: "Missing email address" });
      } else if (!phoneNumber) {
        return res.status(400).json({ error: "Missing phone number" });
      } else if (!studentId) {
        return res.status(400).json({ error: "Missing ID param" });
      }

      const updated = await updateStudent({
        schemaName,
        studentId,
        name,
        age,
        email,
        phoneNumber,
        courseIds,
      });

      res.json({
        message: "Student updated successfully",
        data: updated,
      });
    } catch (err: any) {
      console.error("Error updating student:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

studentsRouter.delete(
  "/:studentId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const studentId = req.params.studentId;

      const updated = await deleteStudent({
        schemaName,
        studentId,
      });

      res.json({
        message: "Student deleted successfully",
        id: updated.id,
      });
    } catch (err: any) {
      console.error("Error updating student:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

export default studentsRouter;
