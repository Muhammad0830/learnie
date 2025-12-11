"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseFormData, CourseSchema } from "@/schemas/courseSchema";
import { useCustomToast } from "@/context/CustomToastContext";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { cn } from "@/lib/utils";
import CustomButton from "@/components/ui/customButton";
import { Check, Eye, Pencil } from "lucide-react";
import Link from "next/link";

export default function CourseEditPage() {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();
  const router = useRouter();
  const { id: courseId } = useParams() as { id: string };

  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useApiQuery<{ course: CourseFormData } & { id: number }>(
    courseId ? `/courses/${courseId}` : null,
    { key: ["course", courseId] }
  );

  const { data: topics, isLoading: isTopicsLoading } = useApiQuery<
    { id: number; title: string; description: string }[] | { message: string }
  >(`/courses/${courseId}/topics`, {
    key: ["topics", courseId],
  });

  const {
    mutate: updateCourse,
    isPending: isUpdating,
    isSuccess,
  } = useApiMutation<
    {
      message: string;
      data: {
        id: string;
        title: string;
        description: string;
      };
    },
    CourseFormData
  >(`/courses/${courseId}`, "put");

  const form = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
    defaultValues: { name: "", description: "" },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (course) {
      reset({
        name: course.course.name,
        description: course.course.description,
      });
    }
  }, [course, reset]);

  const onSubmit = (data: CourseFormData) => {
    updateCourse(data, {
      onSuccess: () => {
        showToast("success", toastT("Course updated successfully"));
        setTimeout(() => {
          router.push(`/courses/${courseId}/view`);
        }, 1000);
      },
      onError: () => {
        showToast("error", toastT("Failed to update course"));
      },
    });
  };

  if (isCourseLoading) return <div className="py-6">{t("Loading")}...</div>;
  if (isCourseError) {
    return (
      <div className="py-6 text-red-600">{t("Failed to fetch course")}</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Edit Course")}
        </h1>

        <Link href={`/courses`}>
          <CustomButton variants="outline">{t("Back to courses")}</CustomButton>
        </Link>
      </div>

      <form
        className="space-y-4 mb-10"
        id="course_edit_form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col relative">
          <label className="font-semibold mb-1">{t("Name")}</label>
          <input
            {...register("name")}
            placeholder={t("CourseName")}
            className={cn(
              "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary w-full",
              errors.name && "border-red-600"
            )}
          />
          {errors.name && (
            <span className="absolute -bottom-[20%] text-red-600 text-xs">
              {t(errors.name.message!)}
            </span>
          )}
        </div>

        <div className="flex flex-col relative">
          <label className="font-semibold mb-1">{t("Description")}</label>
          <textarea
            {...register("description")}
            placeholder={t("CourseDescription")}
            rows={5}
            className={cn(
              "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary w-full",
              errors.description && "border-red-600"
            )}
          />
          {errors.description && (
            <span className="absolute -bottom-[20%] text-red-600 text-xs">
              {t(errors.description.message!)}
            </span>
          )}
        </div>

        <CustomButton
          variants="primary"
          type="submit"
          disabled={isUpdating}
          className="px-3 py-1.5"
        >
          {isUpdating ? (
            t("Saving")
          ) : isSuccess ? (
            <div className="flex gap-2 items-center">
              <span>{t("Saved")}</span>
              <Check className="w-4 h-4 text-green-600" />
            </div>
          ) : (
            t("Save Changes")
          )}
        </CustomButton>
      </form>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-3">{t("Topics in this course")}</h2>

        <Link href={"/courses/create/topics"}>
          <CustomButton variants="primary" className="px-3 py-1.5 mb-3">
            + {t("Add New Topic")}
          </CustomButton>
        </Link>

        {isTopicsLoading && <div>{t("Loading")}</div>}

        {!isTopicsLoading &&
          ((Array.isArray(topics) && topics.length === 0) ||
            (topics &&
              "message" in topics &&
              topics.message === "Course topics not found" && (
                <div className="text-muted-foreground">
                  {t("No topics found")}
                </div>
              )))}

        <div className="space-y-3">
          {Array.isArray(topics) &&
            topics?.map((topic) => (
              <div
                key={topic.id}
                className="p-3 rounded-md border border-primary flex justify-between gap-2 items-center bg-background-secondary"
              >
                <div className="flex flex-col flex-1 min-w-[100px]">
                  <div className="font-semibold">{topic.title}</div>
                  <p className="text-sm text-muted-foreground truncate w-full">
                    {topic.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/courses/topics/edit/${topic.id}`}>
                    <CustomButton
                      variants="outline"
                      className="max-sm:px-2 py-2 flex gap-2 items-center"
                    >
                      <span className="hidden sm:block">{t("Edit")}</span>
                      <Pencil className="w-4 h-4" />
                    </CustomButton>
                  </Link>

                  <Link href={`/courses/topics/${topic.id}`}>
                    <CustomButton
                      variants="outline"
                      className="max-sm:px-2 py-2 flex gap-2 items-center"
                    >
                      <span className="hidden sm:block">{t("View")}</span>
                      <Eye className="w-4 h-4" />
                    </CustomButton>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
