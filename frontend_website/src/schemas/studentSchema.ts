import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const StudentSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(1, "Name is required"),
  age: z.string().min(0, "Age must be a positive number").optional(),
  phoneNumber: z
    .string()
    .min(2, "Phone number is required")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Invalid phone number",
    }),
  studentId: z.string().min(6, "Student Id must be at least 6 characters"),
  role: z.literal("student"),
  courseIds: z.array(z.string()).optional(),
  password: z.string().optional(),
});

export type StudentFormData = z.infer<typeof StudentSchema>;
