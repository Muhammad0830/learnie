import fs from "fs";
import path from "path";
import { queryGlobal } from "../utils/helper";
import { config } from "../config";
import mysql from "mysql2/promise";

export async function registerUniversity(universityName: string) {
  const schemaName = `university_${universityName
    .toLowerCase()
    .replace(/\s+/g, "_")}`;

  const connection = await mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    multipleStatements: true, // ✅ allow multi-statement execution
  });

  try {
    await connection.beginTransaction();

    // Adding record to the global universities table
    await queryGlobal(
      `INSERT INTO universities (name, schema_name) VALUES (:name, :schema_name)`,
      { name: universityName, schema_name: schemaName }
    );

    // Creating the new database/schema
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${schemaName}\``);

    // Reading schema SQL from file
    const schemaFilePath = path.join(__dirname, "universitySchema.sql");
    const schemaSQL = fs.readFileSync(schemaFilePath, "utf8");

    // Creating tables in the new schema
    await connection.changeUser({ database: schemaName });
    await connection.query(schemaSQL);

    await connection.commit();

    console.log(`Created new university schema: ${schemaName}`);
    return { success: true, schemaName };
  } catch (err) {
    await connection.rollback();
    console.error("❌ Error creating university:", err);
    return { success: false, error: err };
  } finally {
    await connection.end();
  }
}
