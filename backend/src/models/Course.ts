import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getCoursesList({ schemaName }: { schemaName: string }) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT * FROM courses"
    );

    return rows;
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

export async function getEachCourse({
  courseId: id,
  schemaName,
}: {
  courseId: string;
  schemaName: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.*, sc.student_id, s.name as student_name FROM courses as c
        LEFT JOIN student_courses as sc ON c.id = sc.course_id
        LEFT JOIN students as s ON sc.student_id = s.id
        WHERE c.id = :id`,
      { id }
    );

    return rows;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function createCourse({
  schemaName,
  name,
  description,
}: {
  schemaName: string;
  name: string;
  description: string;
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO courses (name, description) 
        VALUES (:name, :description)`,
      { name, description }
    );

    return {
      id: rows.insertId,
      name,
      description,
    };
  } catch (err: any) {
    throw new Error(err);
  }
}
