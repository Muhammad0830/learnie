import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export function createAccessToken(payload: object) {
  return jwt.sign(
    payload as any,
    ACCESS_SECRET as any,
    {
      expiresIn: ACCESS_EXPIRES,
    } as any
  );
}
export function createRefreshToken(payload: object) {
  return jwt.sign(
    payload as any,
    REFRESH_SECRET as any,
    {
      expiresIn: REFRESH_EXPIRES,
    } as any
  );
}
export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
