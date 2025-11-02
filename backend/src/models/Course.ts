import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getCoursesList({ schemaName }: { schemaName: string }) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT * FROM courses"
    );

    return rows;
  } catch (error: any) {
    throw new Error(error.message || "Error fetching courses:");
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
      `SELECT * FROM courses
        WHERE id = :id`,
      { id }
    );

    if (rows.length === 0) {
      throw new Error("Course not found");
    }

    const teachers = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT t.id, t.name FROM teachers as t
        LEFT JOIN teacher_courses as tc ON t.id = tc.teacher_id
        WHERE tc.course_id = :id`,
      { id }
    );

    const students = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT s.id, s.name FROM students as s
        LEFT JOIN student_courses as sc ON s.id = sc.student_id
        WHERE sc.course_id = :id`,
      { id }
    );

    return { course: rows[0], teachers: teachers, students: students };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching course:");
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
    throw new Error(err.message || "Error inserting course:");
  }
}

export async function updateCourse({
  schemaName,
  courseId: id,
  name,
  description,
}: {
  schemaName: string;
  courseId: string;
  name: string;
  description: string;
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE courses 
       SET name = :name, description = :description
       WHERE id = :id`,
      { name, description, id }
    );

    return {
      id,
      name,
      description,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error updating course:");
  }
}

export async function deleteCourse({
  schemaName,
  courseId: id,
}: {
  schemaName: string;
  courseId: string;
}) {
  try {
    const course = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM courses WHERE id = :id`,
      { id }
    );

    if (course.length === 0) {
      throw new Error("Course not found");
    }

    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM courses WHERE id = :id`,
      { id }
    );

    return {
      id,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting course:");
  }
}
