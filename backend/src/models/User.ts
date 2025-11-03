import { queryUniversity } from "../utils/helper";

export async function findUserByEmail(
  email: string,
  role: "admin" | "student" | "teacher",
  schemaName: string
) {
  const rows = await queryUniversity(
    schemaName,
    "SELECT * FROM users WHERE email = ? AND role = ?",
    [email, role]
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
  schemaName: string
) {
  const res: any = await queryUniversity(
    schemaName,
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
    [email, passwordHash, name, role]
  );

  return res.insertId as number;
}
