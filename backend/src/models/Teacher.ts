import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getTeachersList({ schemaName }: { schemaName: string }) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT * FROM teachers"
    );

    return rows;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createTeacher({
  schemaName,
  name,
  age,
  email,
  phoneNumber,
  courseIds,
}: {
  schemaName: string;
  name: string;
  age: string | null;
  email: string;
  phoneNumber: string;
  courseIds?: string[];
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO teachers (name, age, email, phoneNumber) 
        VALUES (:name, :age, :email, :phoneNumber)`,
      { name, age: age ?? null, email, phoneNumber }
    );

    if (courseIds) {
      for (const courseId of courseIds) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `INSERT INTO teacher_courses (teacher_id, course_id) 
            VALUES (:teacher_id, :course_id)`,
          { course_id: courseId, teacher_id: rows.insertId }
        );
      }
    }

    return {
      id: rows.insertId,
      name,
      age: age ?? null,
      email,
      phoneNumber,
    };
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function getEachTeacher({
  id,
  schemaName,
}: {
  id: string;
  schemaName: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM teachers
        WHERE id = :id`,
      { id }
    );

    const courses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.id, c.name FROM courses as c
        WHERE c.id IN (SELECT course_id FROM teacher_courses WHERE teacher_id = :id)`,
      { id }
    );

    return { ...rows, courses: courses };
  } catch (err: any) {
    throw new Error(err);
  }
}
