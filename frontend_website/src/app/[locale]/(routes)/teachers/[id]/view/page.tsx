"use client";
import CoursesView from "@/components/CoursesView";
import TeacherView from "@/components/teachers/TeacherView";
import useApiQuery from "@/hooks/useApiQuery";
import { CoursesListResponse, Teacher } from "@/types/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const t = useTranslations("Teachers");
  const { id } = useParams();

  const { data: teacher, isLoading } = useApiQuery<{
    courses: { id: number; name: string }[];
    user: Teacher;
  }>(`/users/${id}`, {
    key: ["teachers"],
  });

  const { data: courses, isLoading: isLoadingCourses } =
    useApiQuery<CoursesListResponse>("/courses", { key: "CourseList" });

  const selectedCoursesIds = teacher?.courses.map((course) =>
    String(course.id)
  );

  const selectedCourses = courses?.courses.filter((course) =>
    selectedCoursesIds?.includes(String(course.id))
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Teacher View")}
        </h1>
        <div className="flex gap-2">
          <Link
            href={"/teachers"}
            className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
          >
            {t("Back to teachers")}
          </Link>
          <Link
            href={`/teachers/${teacher?.user.id}/edit`}
            className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
          >
            {t("Edit")}
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="mb-4">{t("Loading")}</div>
      ) : (
        <TeacherView teacher={teacher?.user} />
      )}

      {courses?.courses.length === 0 ? (
        <div>{t("no courses found")}</div>
      ) : (
        <CoursesView
          isLoading={isLoadingCourses}
          selectedCourses={selectedCourses ?? []}
          translateFrom="Teachers"
        />
      )}
    </div>
  );
};

export default Page;
