import { z } from "zod";

export const TopicItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const TopicsForCourseSchema = z.object({
  courseId: z.number().int(),
  topics: z.array(TopicItemSchema).min(1, "At least one topic is required"),
});

export const SelectedTopicsForCourseSchema = z.object({
  courseId: z.number().int(),
  topicId: z.number().int(),
});

export type TopicsForCourseFormData = z.infer<typeof TopicsForCourseSchema>;
export type SelectedTopicForCourseFormData = z.infer<typeof SelectedTopicsForCourseSchema>;
export type TopicItemFormData = z.infer<typeof TopicItemSchema>;
