import { getUniversityPool, globalPool } from "../db/mysql";
import { RowDataPacket, FieldPacket, ResultSetHeader } from "mysql2/promise";

// For central/global DB
export async function queryGlobal<T extends RowDataPacket[] | ResultSetHeader>(
  sql: string,
  params?: any
): Promise<T> {
  const [rows] = params
    ? await globalPool.query(sql, params)
    : await globalPool.query(sql);

  return rows as T;
}

// For university-specific DB
export async function queryUniversity<
  T extends RowDataPacket[] | ResultSetHeader
>(schemaName: string, sql: string, params?: any): Promise<T> {
  const pool = getUniversityPool(schemaName);
  try {
    const [rows] = params
      ? await pool.query(sql, params)
      : await pool.query(sql);
    return rows as T;
  } finally {
    await pool.end();
  }
}
