import { queryGlobal } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { registerUniversity } from "../db/createUniversity";

export async function getUniversitySchemaList() {
  try {
    const rows = await queryGlobal<RowDataPacket[]>(
      "Select * from universities"
    );

    return rows;
  } catch (error: any) {
    throw new Error(error.message || "Error fetching university schemas:");
  }
}

export async function createUniversity(name: string) {
  try {
    const result = await registerUniversity(name);

    return result;
  } catch (err: any) {
    throw new Error(err.message || "Error creating university:");
  }
}

export async function getUniversity(id: string) {
  try {
    const rows = await queryGlobal<RowDataPacket[]>(
      `SELECT * FROM universities WHERE id = :id`,
      { id }
    );

    return rows;
  } catch (err: any) {
    throw new Error(err.message || "Error fetching university:");
  }
}

export async function updateUniversity(id: string, name: string) {
  try {
    const rows = await queryGlobal<ResultSetHeader>(
      `UPDATE universities SET name = :name WHERE id = :id`,
      { name, id }
    );

    return {
      id,
      name,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error updating university:");
  }
}
