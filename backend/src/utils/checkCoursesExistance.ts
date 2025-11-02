import { RowDataPacket } from "mysql2";
import { queryUniversity } from "./helper";

export async function checkCoursesExistance(
  courseIds: string[],
  schemaName: string
) {
  const courses = await queryUniversity<RowDataPacket[]>(
    schemaName,
    `SELECT id FROM courses WHERE id IN (?)`,
    [courseIds]
  );

  if (courses.length !== courseIds.length) {
    return false;
  }
  return true;
}
