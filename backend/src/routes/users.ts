import express from "express";
import {
  createUser,
  deleteUser,
  getEachUser,
  getUsersList,
  updateUser,
  findUserByEmail,
} from "../models/User";
import { validateUniversitySchema } from "../middlewares/validateUniversitySchema";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import { saveRefreshToken } from "../models/refreshToken";

const usersRouter = express.Router();

const COOKIE_NAME = "refreshToken";
const REFRESH_EXPIRES_MS = 1000 * 60 * 60 * 24 * 7;

usersRouter.post(
  "/",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  validateUniversitySchema,
  async (req: any, res: any) => {
    const schemaName = (req as any).universitySchema;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      email,
      password,
      name,
      age,
      role,
      phoneNumber,
      studentId,
      courseIds,
    } = req.body as {
      email: string;
      password: string;
      name: string;
      role: "student" | "teacher";
      phoneNumber: string;
      studentId?: string;
      courseIds?: string[];
      age: string | null;
    };

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!email) {
      return res.status(400).json({ error: "Missing email" });
    } else if (!phoneNumber) {
      return res.status(400).json({ error: "Missing phoneNumber" });
    } else if (!role) {
      return res.status(400).json({ error: "Missing role" });
    }

    try {
      const existing = await findUserByEmail(email, schemaName);
      if (existing)
        return res.status(409).json({ message: "Email already in use" });

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = await createUser(
        email,
        passwordHash,
        name,
        role,
        schemaName,
        age,
        phoneNumber,
        studentId,
        courseIds
      );

      const accessToken = createAccessToken({ userId, email, role });
      const refreshToken = createRefreshToken({ userId, email, role });

      const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await saveRefreshToken(userId, refreshToken, expiresAt, schemaName);

      res.cookie(COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: REFRESH_EXPIRES_MS,
      });

      return res
        .status(201)
        .json({ accessToken, user: { id: userId, email, name } });
    } catch (err: any) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  }
);

usersRouter.get("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;
    const {
      role,
      page = "1",
      limit = "10",
      search = "",
    } = req.query as {
      role: string;
      page: string;
      limit: string;
      search: string;
    };
    if (!schemaName) return;
    if (!role) return res.status(400).json({ error: "Missing role" });

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedPage) || isNaN(parsedLimit)) {
      return res.status(400).json({ error: "Invalid page or limit" });
    }

    const result = await getUsersList({
      schemaName,
      role,
      page: parsedPage,
      limit: parsedLimit,
      search,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

usersRouter.get("/:userId", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing id" });
    }

    const result = await getEachUser({ id: userId, schemaName });

    res.json(result);
  } catch (err: any) {
    console.error("Error fetching a user:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

usersRouter.put("/:userId", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const userId = req.params.userId;
    const { name, age, phoneNumber, courseIds } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!phoneNumber) {
      return res.status(400).json({ error: "Missing phone number" });
    } else if (!userId) {
      return res.status(400).json({ error: "Missing ID param" });
    }

    const updated = await updateUser({
      schemaName,
      userId,
      name,
      age,
      phoneNumber,
      courseIds,
    });

    res.json({
      message: "Student updated successfully",
      data: updated,
    });
  } catch (err: any) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

usersRouter.delete("/:userId", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const userId = req.params.userId;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const updated = await deleteUser({
      schemaName,
      userId,
    });

    res.json({
      message: "User deleted successfully",
      id: updated.id,
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default usersRouter;
