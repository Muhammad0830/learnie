"use client";
import { cn } from "@/lib/utils";
import { CourseFormData } from "@/schemas/courseSchema";
import { useTranslations } from "next-intl";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { motion } from "framer-motion";

const CourseCreateForm = ({
  register,
  errors,
  onSubmit,
  courseAdd,
  setCourseAdd,
}: {
  register: UseFormRegister<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  courseAdd: boolean;
  setCourseAdd: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const t = useTranslations("Courses");
  return (
    <form id="course_create_form" onSubmit={onSubmit}>
      <div className="relative mb-3">
        <label className="block mb-0.5 font-semibold">{t("Name")}</label>
        <input
          type="text"
          {...register("name")}
          className={cn(
            "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
            errors.name && "border-red-600"
          )}
          placeholder={t("EnterCourseName") as string}
        />
        {errors.name && (
          <p className="text-red-500 sm:text-sm absolute text-xs">
            {t(`${errors.name.message}`)}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block mb-0.5 font-semibold">{t("Description")}</label>
        <input
          type="text"
          {...register("description")}
          className={cn(
            "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
            errors.description && "border-red-600"
          )}
          placeholder={t("EnterCourseDescription") as string}
        />
        {errors.description && (
          <p className="text-red-500 sm:text-sm absolute text-xs">
            {t(`${errors.description.message}`)}
          </p>
        )}
      </div>

      <div>
        <p className="mt-6 text-lg">{t("TopicAdd?")}</p>
        <div className="relative flex gap-2 ">
          <button
            type="button"
            onClick={() => setCourseAdd(false)}
            className="w-20 px-3 py-1 border border-primary/40 rounded-sm cursor-pointer z-1 hover:border-primary"
          >
            {t("No")}
          </button>
          <button
            type="button"
            onClick={() => setCourseAdd(true)}
            className="w-20 px-3 py-1 border border-primary/40 rounded-sm cursor-pointer z-1 hover:border-primary"
          >
            {t("Yes")}
          </button>
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: courseAdd ? "88px" : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
            className="absolute left-0 inset-y-0 w-20 bg-background-secondary rounded-sm z-0"
          ></motion.div>
        </div>
      </div>
    </form>
  );
};

export default CourseCreateForm;
