import { queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { getEachCourse } from "./Course";
import { getUniversityPool } from "../db/mysql";
import { checkCoursesExistance } from "../utils/checkCoursesExistance";

export async function getStudentsList({ schemaName }: { schemaName: string }) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT * FROM students"
    );

    if (rows.length === 0) {
      throw new Error("No students found");
    }

    return rows;
  } catch (error: any) {
    throw new Error(error.message || "Error fetching students:");
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
    if (Array.isArray(courseIds) && courseIds.length > 0) {
      const allCoursesExists = await checkCoursesExistance(
        courseIds,
        schemaName
      );
      if (!allCoursesExists)
        throw new Error("One or more courses do not exist");
    }

    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO students (name, age, email, phoneNumber, studentId) 
        VALUES (:name, :age, :email, :phoneNumber, :studentId)`,
      { name, age: age ?? null, email, phoneNumber, studentId }
    );

    const insertId = rows.insertId;

    if (Array.isArray(courseIds) && courseIds.length > 0) {
      for (const courseId of courseIds) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `INSERT INTO student_courses (student_id, course_id)
           VALUES (:student_id, :course_id)`,
          { student_id: insertId, course_id: courseId }
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
    throw new Error(err.message || "Error inserting student:");
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
      `SELECT * FROM students WHERE id = :id`,
      { id }
    );

    if (rows.length === 0) {
      throw new Error("Student not found");
    }

    const courses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.id, c.name FROM courses as c
        WHERE c.id IN (SELECT course_id FROM student_courses WHERE student_id = :id)`,
      { id }
    );

    return { student: rows[0], courses: courses };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching student:");
  }
}
export async function updateStudent({
  schemaName,
  studentId,
  name,
  age,
  email,
  phoneNumber,
  courseIds,
}: {
  schemaName: string;
  studentId: string;
  name: string;
  email: string;
  phoneNumber: string;
  age?: string | null;
  courseIds?: string[];
}) {
  try {
    if (Array.isArray(courseIds) && courseIds.length > 0) {
      const allCoursesExists = await checkCoursesExistance(
        courseIds,
        schemaName
      );
      if (!allCoursesExists)
        throw new Error("One or more courses do not exist");
    }

    const studentRows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT id FROM students WHERE id = :id`,
      { id: studentId }
    );

    if (studentRows.length === 0) {
      throw new Error("Student not found");
    }

    await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE students 
       SET name = :name, age = :age, email = :email, phoneNumber = :phoneNumber 
       WHERE id = :id`,
      {
        name,
        age: age ?? null,
        email,
        phoneNumber,
        id: studentId,
      }
    );

    if (Array.isArray(courseIds)) {
      const existingCourses = await queryUniversity<RowDataPacket[]>(
        schemaName,
        `SELECT course_id FROM student_courses WHERE student_id = :student_id`,
        { student_id: studentId }
      );

      const currentIds = existingCourses.map((c) => String(c.course_id));
      const newIds = courseIds.map((c) => String(c));

      const needToAdd = newIds.filter((id) => !currentIds.includes(id));
      const needToDelete = currentIds.filter((id) => !newIds.includes(id));

      if (needToDelete.length > 0) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `DELETE FROM student_courses 
           WHERE student_id = ? 
           AND course_id IN (${needToDelete.map(() => "?").join(",")})`,
          [studentId, ...needToDelete]
        );
      }

      for (const courseId of needToAdd) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `INSERT INTO student_courses (student_id, course_id)
           VALUES (:student_id, :course_id)`,
          { student_id: studentId, course_id: courseId }
        );
      }
    }

    const updatedStudent = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM students WHERE id = :id`,
      { id: studentId }
    );

    const updatedCourses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.id, c.name FROM courses AS c
       JOIN student_courses AS sc ON sc.course_id = c.id
       WHERE sc.student_id = :student_id`,
      { student_id: studentId }
    );

    return { ...updatedStudent[0], courses: updatedCourses };
  } catch (err: any) {
    throw new Error(err.message || "Failed to update student");
  }
}

export async function deleteStudent({
  schemaName,
  studentId: id,
}: {
  schemaName: string;
  studentId: string;
}) {
  try {
    const student = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM students WHERE id = :id`,
      { id }
    );

    if (student.length === 0) {
      throw new Error("Student not found");
    }

    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM students WHERE id = :id`,
      { id }
    );

    return {
      id,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting student:");
  }
}
