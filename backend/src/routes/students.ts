import express from "express";
import { query } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const studentsRouter = express.Router();

studentsRouter.get("/", async (request, response) => {
  const rows = await query<RowDataPacket[]>(
    "SELECT * FROM students WHERE id = ?",
    request.query.id
  );
  response.json(rows);
});

export default studentsRouter;
