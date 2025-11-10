import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const studentSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  age: z.string().min(0, "Age must be a positive number"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Invalid phone number",
    }),
  studentId: z.string().min(6, "Student Id must be at least 6 characters"),
  role: z.literal("student"),
  coursesIds: z.array(z.string()).optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
