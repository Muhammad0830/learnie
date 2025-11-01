import { globalPool, getUniversityPool } from "../db/mysql";
import { RowDataPacket, FieldPacket, ResultSetHeader } from "mysql2/promise";

function sqlWithNamedParams(sql: string, params: Record<string, any>) {
  const values: any[] = [];
  const parsedSql = sql.replace(/:(\w+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing SQL param: ${key}`);
    }
    values.push(params[key]);
    return "?";
  });
  return { sql: parsedSql, values };
}

async function runQuery<T extends RowDataPacket[] | ResultSetHeader>(
  poolOrConn: {
    query: (sql: string, params?: any) => Promise<[any, FieldPacket[]]>;
  },
  sql: string,
  params?: any
): Promise<T> {
  let finalSql = sql;
  let values: any[] | undefined;

  if (params) {
    if (Array.isArray(params)) {
      values = params;
    } else {
      const parsed = sqlWithNamedParams(sql, params);
      finalSql = parsed.sql;
      values = parsed.values;
    }
  }

  const [rows] = values
    ? await poolOrConn.query(finalSql, values)
    : await poolOrConn.query(finalSql);
  return rows as T;
}

export async function queryGlobal<T extends RowDataPacket[] | ResultSetHeader>(
  sql: string,
  params?: any
): Promise<T> {
  return runQuery<T>(globalPool, sql, params);
}

export async function queryUniversity<
  T extends RowDataPacket[] | ResultSetHeader
>(schemaName: string, sql: string, params?: any): Promise<T> {
  const pool = getUniversityPool(schemaName);
  return runQuery<T>(pool, sql, params);
}
