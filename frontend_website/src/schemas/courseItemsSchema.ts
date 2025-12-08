import { z } from "zod";

export const LectureSchema = z
  .object({
    courseId: z.string().min(1, "Course id is required"),
    topicId: z.string(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    image_url: z.string().optional().or(z.literal("")),
    video_url: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasImage = !!data.image_url;
    const hasVideo = !!data.video_url;

    if (!hasImage && !hasVideo) {
      ctx.addIssue({
        code: "custom",
        message: "Either image URL or video URL is required",
        path: ["image_url"],
      });

      ctx.addIssue({
        code: "custom",
        message: "Either image URL or video URL is required",
        path: ["video_url"],
      });
    }
  });

export const AssignmentSchema = z.object({
  courseId: z.string().min(1, "Course id is required"),
  topicId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  due_date: z.string().min(1, "Due_date is required"),
});

export const PresentationSchema = z.object({
  courseId: z.string().min(1, "Course id is required"),
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

export interface FormMapType {
  lecture: {
    schema: typeof LectureSchema;
    defaults: {
      title: string;
      content: string;
      image_url: string;
      video_url: string;
    };
  };
  assignment: {
    schema: typeof AssignmentSchema;
    defaults: {
      title: string;
      description: string;
      due_date: string;
      images: string[];
    };
  };
  presentation: {
    schema: typeof PresentationSchema;
    defaults: { title: string; file_url: string };
  };
}

export const formMap = {
  lecture: {
    schema: LectureSchema,
    defaults: {
      title: "",
      content: "",
      image_url: "",
      video_url: "",
      courseId: "",
      topicId: "",
    },
  },
  assignment: {
    schema: AssignmentSchema,
    defaults: {
      title: "",
      description: "",
      due_date: "",
      images: [],
      courseId: "",
      topicId: "",
    },
  },
  presentation: {
    schema: PresentationSchema,
    defaults: {
      title: "",
      file_url: "",
      courseId: "",
      topicId: "",
    },
  },
} as FormMapType;
