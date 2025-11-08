import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import * as UserModel from "../models/User";
import * as RTModel from "../models/refreshToken";
import { validateUniversitySchema } from "../middlewares/validateUniversitySchema";

const authRouter = express.Router();

const COOKIE_NAME = "refreshToken";
const SCHEMA_COOKIE_NAME = "universitySchema";
const REFRESH_EXPIRES_MS = 1000 * 60 * 60 * 24 * 7;

authRouter.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  validateUniversitySchema,
  async (req: any, res: any) => {
    const schemaName = (req as any).universitySchema;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body as {
      email: string;
      password: string;
      role: "admin" | "user";
    };

    const role: "admin" | "student" | "teacher" = req.body.role || "student";

    try {
      const user = await UserModel.findUserByEmail(email, schemaName);
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const accessToken = createAccessToken({ userId: user.id, email, role });
      const refreshToken = createRefreshToken({ userId: user.id, email, role });

      const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await RTModel.saveRefreshToken(
        user.id,
        refreshToken,
        expiresAt,
        schemaName
      );

      res.cookie(COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: REFRESH_EXPIRES_MS,
      });

      res.cookie(SCHEMA_COOKIE_NAME, schemaName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: REFRESH_EXPIRES_MS,
      });

      return res.json({
        accessToken,
        universitySchema: schemaName,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

authRouter.post("/refresh", async (req: any, res: any) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    const schemaName = req.cookies[SCHEMA_COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "No refresh token" });
    if (!schemaName)
      return res.status(400).json({ message: "No university schema provided" });

    let payload: any;
    try {
      payload = verifyRefreshToken(token) as any;
    } catch (e) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const dbToken = await RTModel.findRefreshToken(token, schemaName);
    if (!dbToken)
      return res.status(401).json({ message: "Refresh token revoked" });

    await RTModel.deleteRefreshToken(token, schemaName);

    const newAccessToken = createAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
    const newRefreshToken = createRefreshToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await RTModel.saveRefreshToken(
      payload.userId,
      newRefreshToken,
      expiresAt,
      schemaName
    );

    res.cookie(COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: REFRESH_EXPIRES_MS,
    });

    return res.json({
      accessToken: newAccessToken,
      universitySchema: schemaName,
    });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
});

authRouter.post(
  "/logout",
  validateUniversitySchema,
  async (req: any, res: any) => {
    try {
      const schemaName = (req as any).universitySchema;
      const token = req.cookies[COOKIE_NAME];
      if (token) {
        await RTModel.deleteRefreshToken(token, schemaName);
      }
      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default authRouter;
