"use client";

import { useState, useEffect } from "react";
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
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import UsersSection from "@/components/courses/UsersSection";
import { User } from "@/types/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface UserProps extends User {
  isPendingAdd?: boolean;
  isPendingRemove?: boolean;
}

export default function CourseEditPage() {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();
  const { id: courseId } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  /** ---------------- FETCH COURSE ---------------- */
  const { data: course, isLoading: isCourseLoading } = useApiQuery<{
    course: CourseFormData;
    students: User[];
    teachers: User[];
  }>(courseId ? `/courses/${courseId}` : null, { key: ["course", courseId] });

  // Fetch topics
  const { data: topics, isLoading: isTopicsLoading } = useApiQuery<
    { id: number; title: string; description: string }[] | { message: string }
  >(`/courses/${courseId}/topics`, {
    key: ["topics", courseId],
  });

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
    watch,
  } = form;

  useEffect(() => {
    if (course) {
      reset({
        name: course.course.name,
        description: course.course.description,
      });
    }
  }, [course, reset]);

  const [pendingChanges, setPendingChanges] = useState<{
    added: { user: UserProps }[];
    removed: { user: UserProps }[];
  }>({ added: [], removed: [] });

  const courseName = watch("name"); //eslint-disable-line
  const courseDescription = watch("description");

  const compareCourseName = course?.course.name === courseName;
  const compareCourseDescription =
    course?.course.description === courseDescription;
  const hasNoChanges =
    compareCourseName &&
    compareCourseDescription &&
    pendingChanges.added.length === 0 &&
    pendingChanges.removed.length === 0;

  const { mutate: updateCourse, isPending: isUpdating } = useApiMutation(
    `/courses/${courseId}`,
    "put",
  );

  const { mutate: updateCourseUsers, isPending: isUpdatingUsers } =
    useApiMutation(`/courses/${courseId}/users`, "put");

  const onSubmit = async (data: CourseFormData) => {
    try {
      await new Promise<void>((resolve, reject) => {
        updateCourse(data, {
          onSuccess: () => resolve(),
          onError: () => reject(),
        });
      });

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
            isCourseLoading={isCourseLoading}
          />
        )}

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-3">
            {t("Topics in this course")}
          </h2>

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
                    <Link href={`/courses/${courseId}/topics/${topic.id}/edit`}>
                      <CustomButton
                        variants="outline"
                        className="max-sm:px-2 py-2 flex gap-2 items-center"
                      >
                        <span className="hidden sm:block">{t("Edit")}</span>
                        <Pencil className="w-4 h-4" />
                      </CustomButton>
                    </Link>

                    <Link href={`/courses/${courseId}/topics/${topic.id}`}>
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

        {/* ---------------- SAVE BUTTON ---------------- */}
        <div className="flex gap-2 mt-4">
          <CustomButton
            type="button"
            variants="outline"
            onClick={() => router.push(`/courses/${courseId}/view`)}
          >
            {hasNoChanges ? t("no_changes_go_back") : t("Cancel")}
          </CustomButton>
          {!hasNoChanges && (
            <CustomButton
              type="button"
              variants="primary"
              onClick={() => setOpen(true)}
            >
              {t("Save Changes")}
            </CustomButton>
          )}
        </div>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col gap-4 py-4 max-h-[80vh]">
          <DialogTitle className="flex-1">{t("confirm_changes")}</DialogTitle>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* COURSE CHANGES */}
            <div>
              <h3 className="font-semibold mb-1">{t("course_info")}</h3>

              {compareCourseName && compareCourseDescription ? (
                <p className="text-sm text-muted-foreground">
                  {t("no_changes")}
                </p>
              ) : (
                <div className="text-sm">
                  {!compareCourseName && (
                    <p>
                      <span className="font-medium">{t("Name")}: </span>
                      {course?.course.name} → {form.getValues("name")}
                    </p>
                  )}

                  {!compareCourseDescription && (
                    <p>
                      <span className="font-medium">{t("Description")}: </span>
                      {course?.course.description} →{" "}
                      {form.getValues("description")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* USER CHANGES */}
            <div>
              <h3 className="font-semibold mb-1">{t("user_changes")}</h3>

              {pendingChanges.added.length > 0 && (
                <div className="mb-2">
                  <div className="flex">
                    <div className="bg-green-600/10 rounded px-1 text-green-600 font-medium">
                      {t("added")}:
                    </div>
                  </div>
                  <ul className="text-sm list-disc ml-5">
                    {pendingChanges.added.map((u) => (
                      <li key={u.user.id}>
                        {u.user.name} ({t(u.user.role)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pendingChanges.removed.length > 0 && (
                <div>
                  <div className="flex">
                    <div className="bg-red-600/10 px-1 rounded text-red-600 font-medium">
                      {t("removed")}:
                    </div>
                  </div>
                  <ul className="text-sm list-disc ml-5">
                    {pendingChanges.removed.map((u) => (
                      <li key={u.user.id}>
                        {u.user.name} ({t(u.user.role)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pendingChanges.added.length === 0 &&
                pendingChanges.removed.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {t("no_user_changes")}
                  </p>
                )}
            </div>
          </div>

          <div className="flex-1 flex justify-end gap-2 my-0">
            <CustomButton variants="outline" onClick={() => setOpen(false)}>
              {t("Cancel")}
            </CustomButton>

            <CustomButton
              type="submit"
              form="course_edit_form"
              variants="primary"
              disabled={isSubmitting || isUpdating || isUpdatingUsers}
            >
              {t("confirm_and_save")}
            </CustomButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
