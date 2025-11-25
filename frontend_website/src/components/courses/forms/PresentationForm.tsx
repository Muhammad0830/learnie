"use client";
import { cn } from "@/lib/utils";
import { PresentationFormType } from "@/schemas/courseItemsSchema";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function PresentationForm({
  register,
  errors,
}: {
  register: UseFormRegister<PresentationFormType>;
  errors: FieldErrors<PresentationFormType>;
}) {
  const t = useTranslations("Courses");

  return (
    <div className="space-y-4 flex flex-col gap-2">
      <div className="flex flex-col relative mb-2">
        <label htmlFor="title">{t("Title")}</label>
        <input
          {...register("title")}
          placeholder={t("Title")}
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
        <label htmlFor="file_url">{t("File url")}</label>
        <input
          {...register("file_url")}
          placeholder={t("File url")}
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary",
            errors.file_url && "border-red-600"
          )}
        />
        {errors.file_url && (
          <div className="absolute -bottom-[25%] text-red-600 text-xs">
            {t(`${errors.file_url.message}`)}
          </div>
        )}
      </div>
    </div>
  );
}
