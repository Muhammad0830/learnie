"use client";
import { Course } from "@/types/types";
import { useTranslations } from "next-intl";
import { FieldErrors } from "react-hook-form";
import { TopicsForCourseFormData } from "@/schemas/topicShema";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "../ui/dropdown-menu";
import CustomButton from "../ui/customButton";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";

interface Courses {
  courses: Course[];
}

const CourseSelectDropdown = ({
  coursesData,
  errors,
  selectedCourseId,
  handleSelectCourse,
}: {
  coursesData: Courses | undefined;
  errors: FieldErrors<TopicsForCourseFormData>;
  selectedCourseId: number;
  handleSelectCourse: (courseId: number) => void;
}) => {
  const t = useTranslations("Courses");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    if (!coursesData) return [];
    return coursesData.courses.filter((course: Course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coursesData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const selectedCourse = coursesData?.courses?.find(
    (course) => Number(course.id) === selectedCourseId
  )?.name;

  return (
    <div className="mb-5">
      <label className="font-semibold block mb-1">{t("Select a course")}</label>

      <div className="flex items-center gap-2">
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <CustomButton variants="primary" type="button">
              {selectedCourse ? t("Change") : t("Select a course")}
            </CustomButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            className="min-w-[300px] flex flex-col gap-1 p-1 rounded-sm border border-primary max-h-[300px] overflow-hidden"
          >
            {/* search */}
            <div
              className="pb-1"
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              <Input
                autoFocus
                value={search}
                onChange={handleChange}
                placeholder={t("Type to search")}
                className="px-2 py-1 rounded border-2 border-primary focus-visible:ring-0 focus-visible:border-primary shadow-[0px_0px_5px_2px_#1d65ff50] dark:shadow-[0px_0px_5px_2px_#1d65ff50] mb-1 w-full"
              />
            </div>

            {/* courses list */}
            <div className="flex-1 flex flex-col gap-1 overflow-auto w-full">
              {filteredCourses?.map((course: Course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    handleSelectCourse(Number(course.id));
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center rounded border border-primary/50 bg-primary/5 justify-start group hover:bg-primary/10 gap-2 px-2 py-1.5 text-sm cursor-pointer",
                    selectedCourseId === Number(course.id) &&
                      "bg-primary/20 hover:bg-primary/20"
                  )}
                >
                  {course.name}
                  <span
                    className={cn(
                      "text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-100",
                      selectedCourseId === Number(course.id) && "opacity-100"
                    )}
                  >
                    ✓
                  </span>
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {t("Selected course:")}{" "}
              <span className="text-primary font-semibold">
                {selectedCourse}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {errors.courseId && (
        <p className="text-red-500 text-xs mt-1">
          {t(`${errors.courseId.message}`)}
        </p>
      )}
    </div>
  );
};

export default CourseSelectDropdown;
