import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getEachTeacher,
  getTeachersList,
  updateTeacher,
} from "../models/Teacher";
import { validateUniversitySchema } from "../middlewares/validateUniversitySchema";

const teachersRouter = express.Router();

teachersRouter.get("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const result = await getTeachersList({ schemaName });

    res.json(result);
  } catch (error: any) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

teachersRouter.post("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const { name, age, email, phoneNumber, courseIds } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!email) {
      return res.status(400).json({ error: "Missing email" });
    } else if (!phoneNumber) {
      return res.status(400).json({ error: "Missing phoneNumber" });
    }

    const result = await createTeacher({
      schemaName,
      name,
      age,
      email,
      phoneNumber,
      courseIds,
    });

    res.status(201).json({
      data: result,
    });
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

teachersRouter.get(
  "/:teacherId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const teacherId = req.params.teacherId;
      if (!teacherId) {
        return res.status(400).json({ error: "Missing teacherId" });
      }

      const result = await getEachTeacher({ id: teacherId, schemaName });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

teachersRouter.put(
  "/:teacherId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const teacherId = req.params.teacherId;
      const { name, age, email, phoneNumber, courseIds } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Missing name" });
      } else if (!email) {
        return res.status(400).json({ error: "Missing email address" });
      } else if (!phoneNumber) {
        return res.status(400).json({ error: "Missing phone number" });
      } else if (!teacherId) {
        return res.status(400).json({ error: "Missing ID param" });
      }

      const updated = await updateTeacher({
        schemaName,
        teacherId,
        name,
        age,
        email,
        phoneNumber,
        courseIds,
      });

      res.json({
        message: "Teacher updated successfully",
        data: updated,
      });
    } catch (err: any) {
      console.error("Error updating teacher:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

teachersRouter.delete(
  "/:teacherId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const teacherId = req.params.teacherId;
      if (!teacherId) {
        return res.status(400).json({ error: "Missing teacherId" });
      }

      const result = await deleteTeacher({ schemaName, teacherId });

      res.json({
        message: "Teacher deleted successfully",
        id: result.id,
      });
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

export default teachersRouter;
