"use client";

import useApiQuery from "@/hooks/useApiQuery";
import {
  AssignmentFormType,
  LectureFormType,
  PresentationFormType,
} from "@/schemas/courseItemsSchema";
import { Course, Topic } from "@/types/types";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type FormType = LectureFormType | AssignmentFormType | PresentationFormType;

export default function CourseAndTopicSelector({
  register,
  errors,
  selectedCourseId,
}: {
  register: UseFormRegister<FormType>;
  errors: FieldErrors<FormType>;
  selectedCourseId: number | null | undefined;
}) {
  const t = useTranslations("Courses");

  const { data: courses, isLoading } = useApiQuery<{ courses: Course[] }>(
    "/courses",
    {
      key: ["courses"],
    }
  );

  const selectedCourse = courses?.courses?.find(
    (c) => Number(c.id) === Number(selectedCourseId)
  );

  const isSelectedCourseIdValid =
    Boolean(selectedCourseId) &&
    selectedCourse?.topics_count &&
    selectedCourse?.topics_count > 0;

  const { data: topics, isLoading: isLoadingTopics } = useApiQuery<Topic[]>(
    isSelectedCourseIdValid ? `/courses/${selectedCourseId}/topics` : null,
    {
      key: ["topics", selectedCourseId as number],
      enabled: Boolean(isSelectedCourseIdValid),
    }
  );

  console.log("Another errors", errors);

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="font-semibold">{t("Select Course")}</label>
        {!isLoading ? (
          <select
            {...register("courseId", { required: true })}
            className="border rounded p-2 w-full"
          >
            <option value="">{t("Select Course")}</option>
            {courses?.courses?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <div>{t("Loading")}</div>
        )}
        {errors.courseId && (
          <p className="absolute -bottom-[25%] text-red-500 text-xs">
            {t("Course is required")}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="font-semibold">{t("Select Topic")}</label>
        {!isLoadingTopics ? (
          <select
            {...register("topicId", { required: true })}
            className="border rounded p-2 w-full"
          >
            <option value="">{t("Select Topic")}</option>
            {topics?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        ) : (
          <div>{t("Loading")}</div>
        )}
        {errors.topicId && (
          <p className="absolute -bottom-[25%] text-red-500 text-xs">
            {t("Topic is required")}
          </p>
        )}
      </div>
    </div>
  );
}
