import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  universitySchema: z.string().min(1, "Please select a university schema"),
});

export type UserFormData = z.infer<typeof userLoginSchema>;
