import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const TeacherSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  age: z.string().min(0, "Age must be a positive number").optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Invalid phone number",
    }),
  role: z.literal("teacher"),
  courseIds: z.array(z.string()).optional(),
  password: z.string().optional(),
});

export type TeacherFormData = z.infer<typeof TeacherSchema>;
