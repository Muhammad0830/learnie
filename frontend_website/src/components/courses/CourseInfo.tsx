"use client";
import { EachCourseResponseData } from "@/types/types";
import { useTranslations } from "next-intl";

const CourseInfo = ({ course }: { course: EachCourseResponseData }) => {
  const t = useTranslations("Courses");

  // Format dates
  const createdAt = new Date(course.course.created_at);
  const updatedAt = course.course.updated_at
    ? new Date(course.course.updated_at)
    : null;

  const nice = (d: Date | null) =>
    d ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : "-";

  return (
    <div className="space-y-3 border border-primary rounded-md p-4 bg-primary/5">
      <div className="flex gap-1 items-end">
        <p>{t("Name")}:</p>
        <p className="text-lg font-semibold">{course.course.name}</p>
      </div>

      {course.course.description && (
        <div className="space-y-1">
          <p className="font-semibold">{t("Description")}:</p>
          <p className="text-sm">{course.course.description}</p>
        </div>
      )}

      <div className="flex justify-between">
        <p>
          {t("created_at")}:{" "}
          <span className="font-semibold">{nice(createdAt)}</span>
        </p>
        <p>
          {t("updated_at")}:{" "}
          <span className="font-semibold">
            {updatedAt ? nice(updatedAt) : t("not updated yet")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CourseInfo;
