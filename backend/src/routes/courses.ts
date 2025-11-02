import express from "express";
import { createCourse, deleteCourse, getCoursesList, getEachCourse, updateCourse } from "../models/Course";

const coursesRouter = express.Router();

coursesRouter.get("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const result = await getCoursesList({ schemaName });

    res.json(result);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

coursesRouter.get("/:courseId", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ error: "Missing courseId" });
    }

    const result = await getEachCourse({ courseId, schemaName });

    if (result.length === 0) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

coursesRouter.post("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

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
  } catch (err) {
    console.error("Error inserting course:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

coursesRouter.put("/:courseId", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

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
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

coursesRouter.delete("/:courseId", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ error: "Missing courseId" });
    }

    const result = await deleteCourse({ schemaName, courseId });

    res.json({
      message: "Course deleted successfully",
      id: result.id,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default coursesRouter;
