import { z } from "zod";

export const UserRole = z.enum(
  ["student", "teacher", "admin"],
  "Role must be either 'student' or 'teacher' or 'admin"
);

export const userLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(
    ["student", "teacher", "admin"],
    "Role must be either 'student' or 'teacher' or 'admin'"
  ),
  universitySchema: z.string().min(1, "Please select a university schema"),
});

export type UserFormData = z.infer<typeof userLoginSchema>;
