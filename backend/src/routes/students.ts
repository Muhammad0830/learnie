import express from "express";
import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { createStudent, getStudent } from "../models/Student";

const studentsRouter = express.Router();

studentsRouter.get("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT * FROM students"
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

studentsRouter.get("/all", async (req, res) => {
  try {
    const rows = await queryGlobal<RowDataPacket[]>("SELECT * FROM students");

    if (rows.length === 0) {
      res.status(404).json({ error: "No students found" });
      return;
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

studentsRouter.post("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const { name, age, email, phoneNumber, studentId } = req.body;

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

    const result = await getStudent({ id: studentId, schemaName });

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
