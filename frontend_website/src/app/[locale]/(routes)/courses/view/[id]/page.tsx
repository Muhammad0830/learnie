"use client";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import useApiQuery from "@/hooks/useApiQuery";

import { EachCourseResponseData } from "@/types/types";

import { Users } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import CourseTopicsItem from "@/components/courses/CourseTopicsItem";
import CourseInfo from "@/components/courses/CourseInfo";
import CourseConnectedUsersDialog from "@/components/courses/CourseConnectedUsersDialog";

const CourseViewPage = () => {
  const t = useTranslations("Courses");
  const { id } = useParams();

  const {
    data: course,
    isLoading,
    refetch,
  } = useApiQuery<EachCourseResponseData>(`/courses/${id}`, {
    key: ["courses"],
  });

  if (isLoading) {
    return <div className="my-10">{t("Loading")}...</div>;
  }

  if (!course) {
    return <div>{t("no course found")}</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          <span className="sm:hidden">{t("Course")}</span>
          <span className="max-sm:hidden">{t("Course View")}</span>
        </h1>

        <div className="flex gap-2">
          <Link
            href="/courses"
            className="rounded-sm px-3 py-1.5 bg-primary/5 hover:bg-primary/10 border border-primary text-black dark:text-white text-xs sm:text-[16px]"
          >
            {t("Back to courses")}
          </Link>

          <Link
            href={`/courses/edit/${course.course.id}`}
            className="rounded-sm px-3 py-1.5 bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white text-xs sm:text-[16px]"
          >
            {t("Edit")}
          </Link>
        </div>
      </div>

      {/* COURSE INFORMATION */}
      <CourseInfo course={course} />

      {/* TEACHERS / STUDENTS */}
      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        {/* Teachers */}
        <CourseConnectedUsersDialog
          users={course.teachers}
          icon={<Users className="w-5 h-5" />}
          title={t("Teachers")}
          emptyText={t("no teachers found")}
          link="teachers"
          courseId={course.course.id}
        />

        {/* Students */}
        <CourseConnectedUsersDialog
          users={course.students}
          icon={<Users className="w-5 h-5" />}
          title={t("Students")}
          emptyText={t("no students found")}
          link="students"
          courseId={course.course.id}
        />
      </div>

      {/* TOPICS SECTION */}
      <div className="mt-6">
        <h3 className="md:text-xl text-lg font-semibold mb-3">{t("Topics")}</h3>

        {course.topics.length === 0 ? (
          <div className="w-full h-20 border border-primary bg-primary/5 rounded-md flex justify-center items-center">
            {t("no topics found")}
          </div>
        ) : (
          <div className="space-y-3">
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-2"
            >
              {course.topics.map((topic) => (
                <CourseTopicsItem
                  key={topic.course_topic.id}
                  topic={topic}
                  courseId={course.course.id}
                  refetch={refetch}
                />
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseViewPage;
