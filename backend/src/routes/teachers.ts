import express from "express";
import {
  createTeacher,
  getEachTeacher,
  getTeachersList,
  updateTeacher,
} from "../models/Teacher";

const teachersRouter = express.Router();

teachersRouter.get("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const result = await getTeachersList({ schemaName });

    res.json(result);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

teachersRouter.post("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

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
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

teachersRouter.get("/:teacherId", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    const teacherId = req.params.teacherId;
    if (!teacherId) {
      return res.status(400).json({ error: "Missing teacherId" });
    }

    const result = await getEachTeacher({ id: teacherId, schemaName });

    if (result.length === 0) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

teachersRouter.put("/:teacherId", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

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
});

export default teachersRouter;
