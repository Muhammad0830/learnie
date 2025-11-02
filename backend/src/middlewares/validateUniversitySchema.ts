import { Request, Response, NextFunction } from "express";
import { queryGlobal } from "../utils/helper";
import { RowDataPacket } from "mysql2";

export async function validateUniversitySchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schemaName = req.headers["x-university-schema"] as string;

  if (!schemaName) {
    return res.status(400).json({ error: "Missing university schema" });
  }

  try {
    const rows = await queryGlobal<RowDataPacket[]>(
      "SELECT schema_name FROM universities WHERE schema_name = ?",
      [schemaName]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Invalid or unknown university schema" });
    }

    (req as any).universitySchema = schemaName;

    next();
  } catch (err: any) {
    console.error("Error checking university schema:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
