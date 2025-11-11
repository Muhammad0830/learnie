"use client";
import { Course } from "@/types/types";
import { Eye, FilePen, MonitorPlay, Network, Presentation } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const CoursesView = ({
  isLoading,
  selectedCourses,
}: {
  isLoading: boolean;
  selectedCourses: Course[];
}) => {
  const t = useTranslations("Students");

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-2">{t("Courses")}</h3>
      {isLoading ? (
        <div className="w-full h-20 border border-primary bg-primary/5 rounded-md flex justify-center items-center">
          {t("Loading")}
        </div>
      ) : selectedCourses?.length > 0 ? (
        <div className="border border-primary bg-primary/5 rounded-md p-3 grid gap-3">
          {selectedCourses?.map((course) => (
            <div
              key={course.id}
              className="p-2 rounded-sm border border-primary flex items-center justify-between gap-3 bg-primary/5"
            >
              <label
                htmlFor={course.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <button>
                  <label
                    htmlFor={course.id}
                    className="sm:text-lg text-sm font-semibold cursor-pointer"
                  >
                    {course.name}
                  </label>
                </button>
              </label>
              <div className="flex gap-2">
                {course.topics_count > 0 && (
                  <div className="sm:flex hidden gap-2 items-center cursor-default relative p-1 pr-3">
                    <div className="w-px h-2/3 bg-primary absolute right-0" />
                    <Network className="w-4 h-4" />
                    <span className="text-lg/4">{course.topics_count}</span>
                  </div>
                )}
                <div className="sm:flex hidden gap-2 items-center rounded cursor-default relative p-1 pr-3">
                  <div className="w-px h-2/3 bg-primary absolute right-0" />
                  <MonitorPlay className="w-4 h-4" />
                  <span className="text-lg/4">{course.lectures_count}</span>
                </div>
                <div className="sm:flex hidden gap-2 items-center rounded cursor-default relative p-1 pr-3">
                  <div className="w-px h-2/3 bg-primary absolute right-0" />
                  <FilePen className="w-4 h-4" />
                  <span className="text-lg/4">{course.assignments_count}</span>
                </div>
                <div className="sm:flex hidden gap-2 items-center rounded cursor-default p-1 mr-3">
                  <Presentation className="w-4 h-4" />
                  <span className="text-lg/4">
                    {course.presentations_count}
                  </span>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="flex gap-2 items-center px-2 sm:py-1 py-0.5 sm:text-base text-sm border rounded border-primary bg-primary/20 hover:bg-primary/10 transition-colors duration-150 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  {t("View")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-20 border border-primary bg-primary/5 rounded-md flex justify-center items-center">
          {t("no courses selected")}
        </div>
      )}
    </div>
  );
};

export default CoursesView;
