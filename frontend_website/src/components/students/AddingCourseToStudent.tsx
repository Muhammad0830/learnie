"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Eye, FilePen, MonitorPlay, Network, Presentation } from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/types";
import { cn } from "@/lib/utils";
import { StudentFormData } from "@/schemas/studentSchema";
import { UseFormSetValue } from "react-hook-form";

const AddingCourseToStudent = ({
  isLoading,
  courses,
  selectedCoursesIds,
  setValue,
}: {
  isLoading: boolean;

  courses: Course[];
  selectedCoursesIds: string[] | undefined;
  setValue: UseFormSetValue<StudentFormData>;
}) => {
  const t = useTranslations("Students");

  return (
    <>
      <div className="mt-10">
        <h2 className="sm:text-2xl text-xl font-semibold mb-2">
          {t("Courses")}
        </h2>
        {isLoading ? (
          <div className="w-full h-20 border border-primary bg-primary/5 rounded-md flex justify-center items-center">
            {t("Loading")}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="border border-primary bg-primary/5 rounded-md p-3 grid gap-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className={cn(
                  "p-2 rounded-sm border border-primary flex items-center justify-between gap-3 bg-primary/5",
                  selectedCoursesIds?.includes(String(course.id)) &&
                    "bg-primary/10"
                )}
              >
                <label
                  htmlFor={course.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    id={course.id}
                    className="w-4 h-4 text-white cursor-pointer"
                    checked={
                      selectedCoursesIds
                        ? selectedCoursesIds.includes(String(course.id))
                        : false
                    }
                    onCheckedChange={(e) => {
                      if (e) {
                        setValue("coursesIds", [
                          ...(selectedCoursesIds || []),
                          String(course.id),
                        ]);
                      } else {
                        setValue("coursesIds", [
                          ...(selectedCoursesIds || []).filter(
                            (id: string) => String(id) !== String(course.id)
                          ),
                        ]);
                      }
                    }}
                  />
                  <button>
                    <label
                      htmlFor={course.id}
                      className="text-lg font-semibold cursor-pointer"
                    >
                      {course.name}
                    </label>
                  </button>
                </label>
                <div className="flex gap-2">
                  {course.topics_count > 0 && (
                    <div className="flex gap-2 items-center cursor-default relative p-1 pr-3">
                      <div className="w-px h-2/3 bg-primary absolute right-0" />
                      <Network className="w-4 h-4" />
                      <span className="text-lg/4">{course.topics_count}</span>
                    </div>
                  )}
                  <div className="flex gap-2 items-center rounded cursor-default relative p-1 pr-3">
                    <div className="w-px h-2/3 bg-primary absolute right-0" />
                    <MonitorPlay className="w-4 h-4" />
                    <span className="text-lg/4">{course.lectures_count}</span>
                  </div>
                  <div className="flex gap-2 items-center rounded cursor-default relative p-1 pr-3">
                    <div className="w-px h-2/3 bg-primary absolute right-0" />
                    <FilePen className="w-4 h-4" />
                    <span className="text-lg/4">
                      {course.assignments_count}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center rounded cursor-default p-1 mr-3">
                    <Presentation className="w-4 h-4" />
                    <span className="text-lg/4">
                      {course.presentations_count}
                    </span>
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="flex gap-2 items-center px-2 py-1 border rounded border-primary bg-primary/20 hover:bg-primary/10 transition-colors duration-150 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    {t("View")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-20 border border-primary bg-primary/20 rounded-md flex justify-center items-center">
            {t("No courses found")}
          </div>
        )}
      </div>
    </>
  );
};

export default AddingCourseToStudent;
