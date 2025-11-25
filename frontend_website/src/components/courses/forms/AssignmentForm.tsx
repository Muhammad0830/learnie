"use client";

import { cn } from "@/lib/utils";
import { AssignmentFormType } from "@/schemas/courseItemsSchema";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function AssignmentForm({
  register,
  errors,
}: {
  register: UseFormRegister<AssignmentFormType>;
  errors: FieldErrors<AssignmentFormType>;
}) {
  const t = useTranslations("Courses");

  return (
    <div className="space-y-4 flex flex-col gap-2">
      <div className="flex flex-col relative mb-2">
        <label htmlFor="title">{t("Title")}</label>
        <input
          {...register("title")}
          placeholder={t("Title")}
          id="title"
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary",
            errors.title && "border-red-600"
          )}
        />
        {errors.title && (
          <div className="absolute -bottom-[25%] text-red-600 text-xs">
            {t(`${errors.title.message}`)}
          </div>
        )}
      </div>

      <div className="flex flex-col relative mb-2">
        <label htmlFor="description">{t("Description")}</label>
        <textarea
          {...register("description")}
          placeholder={t("Description")}
          id="description"
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary",
            errors.description && "border-red-600"
          )}
        />
        {errors.description && (
          <div className="absolute -bottom-[20%] text-red-600 text-xs">
            {t(`${errors.description.message}`)}
          </div>
        )}
      </div>

      <div className="flex flex-col relative mb-2">
        <label htmlFor="due_date">{t("Due_date")}</label>
        <input
          type="date"
          {...register("due_date")}
          placeholder={t("Due_date")}
          id="due_date"
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary",
            errors.due_date && "border-red-600"
          )}
        />
        {errors.due_date && (
          <div className="absolute -bottom-[25%] text-red-600 text-xs">
            {t(`${errors.due_date.message}`)}
          </div>
        )}
      </div>
    </div>
  );
}
