import { z } from "zod";

export const TopicItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const TopicsForCourseSchema = z.object({
  courseId: z.number().int(),
  topics: z.array(TopicItemSchema).min(1, "At least one topic is required"),
});

export type TopicsForCourseFormData = z.infer<typeof TopicsForCourseSchema>;
export type TopicItemFormData = z.infer<typeof TopicItemSchema>;
