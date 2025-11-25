"use client";
import { cn } from "@/lib/utils";
import { LectureFormType } from "@/schemas/courseItemsSchema";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function LectureForm({
  register,
  errors,
}: {
  register: UseFormRegister<LectureFormType>;
  errors: FieldErrors<LectureFormType>;
}) {
  const t = useTranslations("Courses");

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex flex-col mb-2">
        <label htmlFor="title">{t("Title")}</label>
        <input
          {...register("title")}
          id="title"
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
        <label htmlFor="content">{t("Content")}</label>
        <textarea
          {...register("content")}
          placeholder={t("Content")}
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary",
            errors.content && "border-red-600"
          )}
        />
        {errors.content && (
          <div className="absolute -bottom-[20%] text-red-600 text-xs">
            {t(`${errors.content.message}`)}
          </div>
        )}
      </div>

      <div className="relative flex flex-col mb-2">
        <label htmlFor="image_url">{t("Image_url")}</label>
        <input
          {...register("image_url")}
          id="image_url"
          placeholder={t("Image_url")}
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary",
            errors.image_url && "border-red-600"
          )}
        />
        {errors.image_url && (
          <div className="absolute -bottom-[25%] text-red-600 text-xs">
            {t(`${errors.image_url.message}`)}
          </div>
        )}
      </div>

      <div className="relative flex flex-col mb-2">
        <label htmlFor="video_url">{t("Video_url")}</label>
        <input
          {...register("video_url")}
          id="video_url"
          placeholder={t("Video_url")}
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary",
            errors.video_url && "border-red-600"
          )}
        />
        {errors.video_url && (
          <div className="absolute -bottom-[25%] text-red-600 text-xs">
            {t(`${errors.video_url.message}`)}
          </div>
        )}
      </div>
    </div>
  );
}
