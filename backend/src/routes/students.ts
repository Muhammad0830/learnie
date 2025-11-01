import express from "express";
import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const studentsRouter = express.Router();

const students = [
  {
    id: 1,
    title: "Student 1",
    content: "This is the first Student.",
  },
  {
    id: 2,
    title: "Student 2",
    content: "This is the second Student.",
  },
];

studentsRouter.get("/", async (request, response) => {
  response.json(students);
});

studentsRouter.get("/all", async (request, response) => {
  try {
    const rows = await queryGlobal<RowDataPacket[]>("SELECT * FROM students");

    if (rows.length === 0) {
      response.status(404).json({ error: "No students found" });
      return;
    }

    console.log("students", rows);
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

export default studentsRouter;
