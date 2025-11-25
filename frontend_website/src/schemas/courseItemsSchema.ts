import { z } from "zod";

export const LectureSchema = z.object({
  courseId: z.string(),
  topicId: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
});

export const AssignmentSchema = z.object({
  courseId: z.string(),
  topicId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  due_date: z.string().min(1, "Due_date is required"),
});

export const PresentationSchema = z.object({
  courseId: z.string(),
  topicId: z.string(),
  title: z.string().min(1, "Title is required"),
  file_url: z.string().min(1, "File url is required"),
});

export type LectureFormType = z.infer<typeof LectureSchema>;
export type AssignmentFormType = z.infer<typeof AssignmentSchema>;
export type PresentationFormType = z.infer<typeof PresentationSchema>;
export type FormType =
  | LectureFormType
  | AssignmentFormType
  | PresentationFormType;
