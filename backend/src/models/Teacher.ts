import { checkCoursesExistance } from "../utils/checkCoursesExistance";
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
    throw new Error(error.message || "Error fetching teachers:");
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
    throw new Error(err.message || "Error inserting teacher:");
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

    if (rows.length === 0) {
      throw new Error("Teacher not found");
    }

    const courses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.id, c.name FROM courses as c
        WHERE c.id IN (SELECT course_id FROM teacher_courses WHERE teacher_id = :id)`,
      { id }
    );

    return { teacher: rows[0], courses: courses };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching teacher:");
  }
}

export async function updateTeacher({
  schemaName,
  teacherId,
  name,
  age,
  email,
  phoneNumber,
  courseIds,
}: {
  schemaName: string;
  teacherId: string;
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

    const teacherRows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT id FROM teachers WHERE id = :id`,
      { id: teacherId }
    );

    if (teacherRows.length === 0) {
      throw new Error("Teacher not found");
    }

    await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE teachers 
       SET name = :name, age = :age, email = :email, phoneNumber = :phoneNumber 
       WHERE id = :id`,
      {
        name,
        age: age ?? null,
        email,
        phoneNumber,
        id: teacherId,
      }
    );

    if (Array.isArray(courseIds)) {
      const existingCourses = await queryUniversity<RowDataPacket[]>(
        schemaName,
        `SELECT course_id FROM teacher_courses WHERE teacher_id = :teacher_id`,
        { teacher_id: teacherId }
      );

      const currentIds = existingCourses.map((c) => String(c.course_id));
      const newIds = courseIds.map((c) => String(c));

      const needToAdd = newIds.filter((id) => !currentIds.includes(id));
      const needToDelete = currentIds.filter((id) => !newIds.includes(id));

      if (needToDelete.length > 0) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `DELETE FROM teacher_courses 
           WHERE teacher_id = ? 
           AND course_id IN (${needToDelete.map(() => "?").join(",")})`,
          [teacherId, ...needToDelete]
        );
      }

      for (const courseId of needToAdd) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `INSERT INTO teacher_courses (teacher_id, course_id)
           VALUES (:teacher_id, :course_id)`,
          { teacher_id: teacherId, course_id: courseId }
        );
      }
    }

    const updatedTeacher = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM teachers WHERE id = :id`,
      { id: teacherId }
    );

    const updatedCourses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.id, c.name FROM courses AS c
       JOIN teacher_courses AS tc ON tc.course_id = c.id
       WHERE tc.teacher_id = :teacher_id`,
      { teacher_id: teacherId }
    );

    return { ...updatedTeacher[0], courses: updatedCourses };
  } catch (err: any) {
    throw new Error(err.message || "Failed to update teacher");
  }
}

export async function deleteTeacher({
  schemaName,
  teacherId: id,
}: {
  schemaName: string;
  teacherId: string;
}) {
  try {
    const teacher = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM teachers WHERE id = :id`,
      { id }
    );

    if (teacher.length === 0) {
      throw new Error("Teacher not found");
    }

    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM teachers WHERE id = :id`,
      { id }
    );

    return {
      id,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting teacher:");
  }
}
