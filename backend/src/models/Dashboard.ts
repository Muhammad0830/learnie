import { RowDataPacket } from "mysql2";
import { queryUniversity } from "../utils/helper";

export async function getDashboardData({ schemaName }: { schemaName: string }) {
  try {
    const [courseCount] = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT COUNT(*) as count FROM courses"
    );

    const [teacherCount] = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT COUNT(*) as count FROM users WHERE role = 'teacher'"
    );

    const [studentCount] = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT COUNT(*) as count FROM users WHERE role = 'student'"
    );

    const [adminCount] = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );

    const recentStudents = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT id, name, email FROM users WHERE role = 'student' ORDER BY created_at DESC LIMIT 5"
    );

    const recentTeachers = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT id, name, email FROM users WHERE role = 'teacher' ORDER BY created_at DESC LIMIT 5"
    );

    const recentAdmins = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY created_at DESC LIMIT 5"
    );

    const recentCourses = await queryUniversity<RowDataPacket[]>(
      schemaName,
      "SELECT id, name, description FROM courses ORDER BY created_at DESC LIMIT 5"
    );

    return {
      counts: {
        courses: courseCount.count,
        teachers: teacherCount.count,
        students: studentCount.count,
        admins: adminCount.count,
      },
      recents: {
        students: recentStudents,
        teachers: recentTeachers,
        courses: recentCourses,
        admin: recentAdmins,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || "Error fetching dashboard data:");
  }
}
