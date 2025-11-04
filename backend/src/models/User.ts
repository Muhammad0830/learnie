import { queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { getEachCourse } from "./Course";
import { getUniversityPool } from "../db/mysql";
import { checkCoursesExistance } from "../utils/checkCoursesExistance";

export async function findUserByEmail(email: string, schemaName: string) {
  const rows = await queryUniversity(
    schemaName,
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  const arr = rows as any[];
  return arr[0] ?? null;
}

export async function findUserById(id: number, schemaName: string) {
  const rows = await queryUniversity(
    schemaName,
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  const arr = rows as any[];
  return arr[0] ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string,
  role: "admin" | "student" | "teacher" = "student",
  schemaName: string,
  age: string | null,
  phoneNumber: string,
  studentId?: string,
  courseIds?: string[]
) {
  try {
    if (Array.isArray(courseIds) && courseIds.length > 0) {
      const allCoursesExists = await checkCoursesExistance(
        courseIds,
        schemaName
      );
      if (!allCoursesExists)
        throw new Error("One or more courses do not exist");
    }

    let params: any = {
      email,
      password_hash: passwordHash,
      name,
      role,
      age,
      phoneNumber,
    };

    let sql = `INSERT INTO users (email, password_hash, name, role, age, phoneNumber) 
        VALUES (:email, :password_hash, :name, :role, :age, :phoneNumber)`;

    if (role === "student") {
      sql = `INSERT INTO users (email, password_hash, name, role, age, phoneNumber, studentId) 
          VALUES (:email, :password_hash, :name, :role, :age, :phoneNumber, :studentId)`;
      params.studentId = studentId;
    }

    const res: any = await queryUniversity(schemaName, sql, params);

    if (Array.isArray(courseIds) && courseIds.length > 0) {
      for (const courseId of courseIds) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `INSERT INTO users_courses (user_id, course_id)
           VALUES (:user_id, :course_id)`,
          { user_id: res.insertId, course_id: courseId }
        );
      }
    }

    return res.insertId as number;
  } catch (err: any) {
    throw new Error(err.message || "Error inserting a user:");
  }
}

export async function getUsersList({
  schemaName,
  role,
}: {
  schemaName: string;
  role?: string;
}) {
  try {
    console.log("role", role);
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT * FROM users WHERE role = :role",
      {
        role,
      }
    );
    console.log("rows", rows);

    if (rows.length === 0) {
      throw new Error("No users found");
    }

    return rows;
  } catch (error: any) {
    throw new Error(error.message || "Error fetching users:");
  }
}

// export async function createUser({
//   schemaName,
//   name,
//   age,
//   email,
//   phoneNumber,
//   studentId,
//   courseIds,
//   role,
// }: {
//   schemaName: string;
//   name: string;
//   age: string | null;
//   email: string;
//   phoneNumber: string;
//   role: "student" | "teacher";
//   courseIds?: string[];
//   studentId?: string;
// }) {
//   try {
//     if (Array.isArray(courseIds) && courseIds.length > 0) {
//       const allCoursesExists = await checkCoursesExistance(
//         courseIds,
//         schemaName
//       );
//       if (!allCoursesExists)
//         throw new Error("One or more courses do not exist");
//     }

//     let insertId;

//     if (role === "student") {
//       const rows = await queryUniversity<ResultSetHeader>(
//         schemaName,
//         `INSERT INTO users (name, age, email, phoneNumber, studentId, role)
//         VALUES (:name, :age, :email, :phoneNumber, :studentId, :role)`,
//         { name, age: age ?? null, email, phoneNumber, studentId, role }
//       );

//       insertId = rows.insertId;
//     } else {
//       const rows = await queryUniversity<ResultSetHeader>(
//         schemaName,
//         `INSERT INTO users (name, age, email, phoneNumber, role)
//         VALUES (:name, :age, :email, :phoneNumber, :role)`,
//         { name, age: age ?? null, email, phoneNumber, role }
//       );

//       insertId = rows.insertId;
//     }

//     if (Array.isArray(courseIds) && courseIds.length > 0) {
//       for (const courseId of courseIds) {
//         await queryUniversity<ResultSetHeader>(
//           schemaName,
//           `INSERT INTO users_courses (user_id, course_id)
//            VALUES (:user_id, :course_id)`,
//           { user_id: insertId, course_id: courseId }
//         );
//       }
//     }

//     return {
//       id: insertId,
//       name,
//       age: age ?? null,
//       email,
//       phoneNumber,
//       studentId,
//     };
//   } catch (err: any) {
//     throw new Error(err.message || "Error inserting a user:");
//   }
// }

export async function getEachUser({
  id,
  schemaName,
}: {
  id: string;
  schemaName: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM users WHERE id = :id`,
      { id }
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const courses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.id, c.name FROM courses as c
        WHERE c.id IN (SELECT course_id FROM users_courses WHERE user_id = :id)`,
      { id }
    );

    return { user: rows[0], courses: courses };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching a user:");
  }
}
export async function updateUser({
  schemaName,
  userId,
  name,
  age,
  phoneNumber,
  courseIds,
}: {
  schemaName: string;
  userId: string;
  name: string;
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

    const userRows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT id FROM users WHERE id = :id`,
      { id: userId }
    );

    if (userRows.length === 0) {
      throw new Error("User not found");
    }

    await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE users 
       SET name = :name, age = :age, phoneNumber = :phoneNumber 
       WHERE id = :id`,
      {
        name,
        age: age ?? null,
        phoneNumber,
        id: userId,
      }
    );

    if (Array.isArray(courseIds)) {
      const existingCourses = await queryUniversity<RowDataPacket[]>(
        schemaName,
        `SELECT course_id FROM users_courses WHERE user_id = :user_id`,
        { user_id: userId }
      );

      const currentIds = existingCourses.map((c) => String(c.course_id));
      const newIds = courseIds.map((c) => String(c));

      const needToAdd = newIds.filter((id) => !currentIds.includes(id));
      const needToDelete = currentIds.filter((id) => !newIds.includes(id));

      if (needToDelete.length > 0) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `DELETE FROM users_courses 
           WHERE user_id = ? 
           AND course_id IN (${needToDelete.map(() => "?").join(",")})`,
          [userId, ...needToDelete]
        );
      }

      for (const courseId of needToAdd) {
        await queryUniversity<ResultSetHeader>(
          schemaName,
          `INSERT INTO users_courses (user_id, course_id)
           VALUES (:user_id, :course_id)`,
          { user_id: userId, course_id: courseId }
        );
      }
    }

    const updatedUser = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM users WHERE id = :id`,
      { id: userId }
    );

    const updatedCourses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT c.id, c.name FROM courses AS c
       JOIN users_courses AS uc ON uc.course_id = c.id
       WHERE uc.user_id = :user_id`,
      { user_id: userId }
    );

    return { ...updatedUser[0], courses: updatedCourses };
  } catch (err: any) {
    throw new Error(err.message || "Failed to update user");
  }
}

export async function deleteUser({
  schemaName,
  userId: id,
}: {
  schemaName: string;
  userId: string;
}) {
  try {
    const user = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM users WHERE id = :id`,
      { id }
    );

    if (user.length === 0) {
      throw new Error("Student not found");
    }

    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM users WHERE id = :id`,
      { id }
    );

    return {
      id,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting user:");
  }
}
