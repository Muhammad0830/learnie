import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getStudents({ schemaName }: { schemaName: string }) {
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
}: {
  schemaName: string;
  name: string;
  age: string | null;
  email: string;
  phoneNumber: string;
  studentId: string;
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO students (name, age, email, phoneNumber, studentId) 
        VALUES (:name, :age, :email, :phoneNumber, :studentId)`,
      { name, age: age ?? null, email, phoneNumber, studentId }
    );

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

export async function getStudent({
  id: studentId,
  schemaName,
}: {
  id: string;
  schemaName: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM students WHERE studentId = :studentId`,
      { studentId }
    );

    return rows;
  } catch (err: any) {
    throw new Error(err);
  }
}
