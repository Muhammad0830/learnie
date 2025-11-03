import { queryUniversity } from "../utils/helper";

export async function saveRefreshToken(
  userId: number,
  token: string,
  expiresAt: string,
  schemaName: string
) {
  await queryUniversity(
    schemaName,
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (:userId, :token, :expiresAt)",
    { userId: userId, token: token, expiresAt: expiresAt }
  );
}

export async function deleteRefreshToken(token: string, schemaName: string) {
  await queryUniversity(
    schemaName,
    "DELETE FROM refresh_tokens WHERE token = ?",
    [token]
  );
}

export async function findRefreshToken(token: string, schemaName: string) {
  const rows = await queryUniversity(
    schemaName,
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [token]
  );
  const arr = rows as any[];
  return arr[0] ?? null;
}

export async function deleteTokensForUser(userId: number, schemaName: string) {
  await queryUniversity(
    schemaName,
    "DELETE FROM refresh_tokens WHERE user_id = ?",
    [userId]
  );
}
