"use client";
import CoursesView from "@/components/CoursesView";
import StudentView from "@/components/students/StudentView";
import CustomButton from "@/components/ui/customButton";
import { useAuth } from "@/context/AuthContext";
import useApiQuery from "@/hooks/useApiQuery";
import { CoursesListResponse, Student } from "@/types/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const t = useTranslations("Students");
  const { id } = useParams();

  const { user } = useAuth();
  const router = useRouter();

  const { data: student, isLoading } = useApiQuery<{
    courses: { id: number; name: string }[];
    user: Student;
  }>(`/users/${id}`, {
    key: ["students"],
  });

  const { data: courses, isLoading: isLoadingCourses } =
    useApiQuery<CoursesListResponse>("/courses", { key: "CourseList" });

  const selectedCoursesIds = student?.courses.map((course) =>
    String(course.id)
  );

  const selectedCourses = courses?.courses.filter((course) =>
    selectedCoursesIds?.includes(String(course.id))
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        {t("Loading")}
      </div>
    );
  }

  if (!student || !student.user.id) {
    return (
      <div className="">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Student View")}
          </h1>
          <div className="flex gap-2">
            <Link
              href={"/students"}
              className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
            >
              {t("Back to students")}
            </Link>
          </div>
        </div>

        <div className="w-full h-[100px] flex justify-center items-center border border-primary rounded-sm bg-primary/5">
          {t("Student not found")}
        </div>
      </div>
    );
  }

  if (user?.role === "student") {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-full">
        <div className="sm:text-2xl text-xl font-bold">
          {t("You are not authorized to view this page")}
        </div>
        <CustomButton
          onClick={() => {
            router.back();
          }}
          variants="outline"
        >
          {t("Go back")}
        </CustomButton>
      </div>
    );
  } else {
    return (
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Student View")}
          </h1>
          <div className="flex gap-2">
            <Link
              href={"/students"}
              className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
            >
              {t("Back to students")}
            </Link>
            <Link
              href={`/students/${student?.user.id}/edit`}
              className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
            >
              {t("Edit")}
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="mb-4">{t("Loading")}</div>
        ) : (
          <StudentView student={student?.user} />
        )}

        {courses?.courses?.length === 0 ? (
          <div>{t("no courses found")}</div>
        ) : (
          <CoursesView
            isLoading={isLoadingCourses}
            selectedCourses={selectedCourses ?? []}
            translateFrom="Students"
          />
        )}
      </div>
    );
  }
};

export default Page;
