import { z } from "zod";

export const TopicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type TopicFormData = z.infer<typeof TopicSchema>;
