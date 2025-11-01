import express from "express";
import {
  createStudent,
  getEachStudent,
  getStudentsList,
} from "../models/Student";

const studentsRouter = express.Router();

studentsRouter.get("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const result = await getStudentsList({ schemaName });

    res.json(result);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

studentsRouter.post("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

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
  } catch (err) {
    console.error("Error inserting student:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

studentsRouter.get("/:studentId", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const studentId = req.params.studentId;
    if (!studentId) {
      return res.status(400).json({ error: "Missing studentId" });
    }

    const result = await getEachStudent({ id: studentId, schemaName });

    if (result.length === 0) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default studentsRouter;
