import express from "express";
import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const studentsRouter = express.Router();

studentsRouter.get("/", async (req, res) => {
  try {
    const schemaName = req.headers["x-university-schema"] as string;
    if (!schemaName) {
      return res.status(400).json({ error: "Missing university schema" });
    }

    console.log("working");
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

    console.log("students", rows);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default studentsRouter;
