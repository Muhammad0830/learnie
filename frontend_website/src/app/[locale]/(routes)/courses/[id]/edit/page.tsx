"use client";

import React, { useState, useEffect } from "react";
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
import { Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import UsersSection from "@/components/courses/UsersSection";
import { User, Role } from "@/types/types";

export default function CourseEditPage() {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();
  const { id: courseId } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  /** ---------------- FETCH COURSE ---------------- */
  const { data: course, isLoading: isCourseLoading } = useApiQuery<{
    course: CourseFormData;
    students: User[];
    teachers: User[];
  }>(courseId ? `/courses/${courseId}` : null, { key: ["course", courseId] });

  /** ---------------- FORM ---------------- */
  const form = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
    defaultValues: { name: "", description: "" },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (course) {
      reset({
        name: course.course.name,
        description: course.course.description,
      });
    }
  }, [course, reset]);

  /** ---------------- PENDING USERS STATE ---------------- */
  const [pendingChanges, setPendingChanges] = useState<{
    added: { userId: string; role: Role }[];
    removed: { userId: string }[];
  }>({ added: [], removed: [] });

  /** ---------------- MUTATIONS ---------------- */
  const {
    mutate: updateCourse,
    isPending: isUpdating,
    isSuccess,
  } = useApiMutation(`/courses/${courseId}`, "put");

  const { mutate: updateCourseUsers, isPending: isUpdatingUsers } =
    useApiMutation(`/courses/${courseId}/users`, "put");

  /** ---------------- FORM SUBMIT ---------------- */
  const onSubmit = async (data: CourseFormData) => {
    try {
      // Save course data
      await new Promise<void>((resolve, reject) => {
        updateCourse(data, {
          onSuccess: () => resolve(),
          onError: () => reject(),
        });
      });

      // Save pending users
      if (
        pendingChanges.added.length > 0 ||
        pendingChanges.removed.length > 0
      ) {
        await new Promise<void>((resolve, reject) => {
          updateCourseUsers(
            {
              additions: pendingChanges.added,
              removals: pendingChanges.removed,
            },
            {
              onSuccess: () => resolve(),
              onError: () => reject(),
            },
          );
        });
      }

      showToast("success", toastT("Course updated successfully"));
      router.push(`/courses/${courseId}/view`);
    } catch {
      showToast("error", toastT("Failed to update course"));
    }
  };

  /** ---------------- AUTH CHECK ---------------- */
  if (!user || isCourseLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        {t("Loading")}
      </div>
    );
  }

  if (user.role === "student" || user.role === "teacher") {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <div className="sm:text-2xl text-xl font-bold">
          {t("You are not authorized to view this page")}
        </div>
        <CustomButton onClick={() => router.back()} variants="outline">
          {t("Go back")}
        </CustomButton>
      </div>
    );
  }

  /** ---------------- RENDER ---------------- */
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
        className="space-y-4 mb-6"
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
              errors.name && "border-red-600",
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
              errors.description && "border-red-600",
            )}
          />
          {errors.description && (
            <span className="absolute -bottom-[20%] text-red-600 text-xs">
              {t(errors.description.message!)}
            </span>
          )}
        </div>

        {/* ---------------- USERS SECTION ---------------- */}
        {course && (
          <UsersSection
            courseId={courseId}
            students={course.students}
            teachers={course.teachers}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
          />
        )}

        {/* ---------------- SAVE BUTTON ---------------- */}
        <div className="flex gap-2 mt-4">
          <CustomButton
            type="button"
            variants="outline"
            onClick={() => router.push(`/courses/${courseId}/view`)}
          >
            {t("Cancel")}
          </CustomButton>
          <CustomButton
            type="submit"
            variants="primary"
            disabled={isSubmitting || isUpdating || isUpdatingUsers}
          >
            {isSubmitting || isUpdating || isUpdatingUsers ? (
              t("Saving...")
            ) : isSuccess ? (
              <div className="flex gap-2 items-center">
                <span>{t("Saved")}</span>
                <Check className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              t("Save Changes")
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
