import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getStudentsList({ schemaName }: { schemaName: string }) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT * FROM students"
    );

    return rows;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

export async function createStudent({
  schemaName,
  name,
  age,
  email,
  phoneNumber,
  studentId,
  courseIds,
}: {
  schemaName: string;
  name: string;
  age: string | null;
  email: string;
  phoneNumber: string;
  studentId: string;
  courseIds?: string[];
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO students (name, age, email, phoneNumber, studentId) 
        VALUES (:name, :age, :email, :phoneNumber, :studentId)`,
      { name, age: age ?? null, email, phoneNumber, studentId }
    );

    const insertId = rows.insertId;

    if (courseIds) {
      for (const courseId of courseIds) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `INSERT INTO student_courses (student_id, course_id) 
          VALUES (:student_id, :course_id)`,
          { course_id: courseId, student_id: insertId }
        );
      }
    }

    return {
      id: rows.insertId,
      name,
      age: age ?? null,
      email,
      phoneNumber,
      studentId,
    };
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function getEachStudent({
  id,
  schemaName,
}: {
  id: string;
  schemaName: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT s.*, sc.course_id, c.name as course_name FROM students as s 
        LEFT JOIN student_courses as sc ON s.id = sc.student_id
        LEFT JOIN courses as c ON sc.course_id = c.id
        WHERE s.id = :id`,
      { id }
    );

    return rows;
  } catch (err: any) {
    throw new Error(err);
  }
}
