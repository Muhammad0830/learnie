import { config } from "../config";
import mysql from "mysql2/promise";

export const globalPool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME, // your central DB, e.g. 'main_admin_db'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const universityPools = new Map<string, mysql.Pool>();
export function getUniversityPool(schemaName: string) {
  // If pool doesn't exist, create and cache it
  if (!universityPools.has(schemaName)) {
    const pool = mysql.createPool({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: schemaName,
      waitForConnections: true,
      connectionLimit: 10, // each pool manages up to 10 connections
      queueLimit: 0,
    });

    universityPools.set(schemaName, pool);
  }

  return universityPools.get(schemaName)!;
}
