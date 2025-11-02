import express from "express";
import {
  createCourse,
  deleteCourse,
  getCoursesList,
  getEachCourse,
  updateCourse,
} from "../models/Course";
import { validateUniversitySchema } from "../middlewares/validateUniversitySchema";

const coursesRouter = express.Router();

coursesRouter.get("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const result = await getCoursesList({ schemaName });

    res.json(result);
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

coursesRouter.get("/:courseId", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ error: "Missing courseId" });
    }

    const result = await getEachCourse({ courseId, schemaName });

    res.json(result);
  } catch (err: any) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

coursesRouter.post("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!description) {
      return res.status(400).json({ error: "Missing description" });
    }

    const result = await createCourse({
      schemaName,
      name,
      description,
    });

    res.status(201).json({
      data: result,
    });
  } catch (err: any) {
    console.error("Error inserting course:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

coursesRouter.put("/:courseId", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const courseId = req.params.courseId;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!description) {
      return res.status(400).json({ error: "Missing description" });
    }

    const result = await updateCourse({
      schemaName,
      courseId,
      name,
      description,
    });

    res.json({
      message: "Course updated successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

coursesRouter.delete(
  "/:courseId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const courseId = req.params.courseId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      }

      const result = await deleteCourse({ schemaName, courseId });

      res.json({
        message: "Course deleted successfully",
        id: result.id,
      });
    } catch (error: any) {
      console.error("Error deleting course:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

export default coursesRouter;
