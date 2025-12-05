"use client";

import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TopicItemFormData } from "@/schemas/topicShema";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/ui/customButton";

export default function TopicEditForm({
  register,
  errors,
  onSubmit,
  isSubmitting,
}: {
  register: UseFormRegister<TopicItemFormData>;
  errors: FieldErrors<TopicItemFormData>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting?: boolean;
}) {
  const t = useTranslations("Courses");

  return (
    <form id="topic_edit_form" onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col relative mb-3">
        <label htmlFor="title" className="font-semibold mb-1">
          {t("Title")}
        </label>
        <input
          id="title"
          {...register("title")}
          placeholder={t("TopicTitle") as string}
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary w-full",
            errors.title && "border-red-600"
          )}
        />
        {errors.title && (
          <div className="absolute -bottom-[25%] text-red-600 text-xs">
            {t(`${errors.title.message}`)}
          </div>
        )}
      </div>

      <div className="flex flex-col relative mb-4">
        <label htmlFor="description" className="font-semibold mb-1">
          {t("Description")}
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder={t("TopicDescription") as string}
          rows={6}
          className={cn(
            "px-3 py-1.5 rounded-sm border border-primary bg-background-secondary w-full",
            errors.description && "border-red-600"
          )}
        />
        {errors.description && (
          <div className="absolute -bottom-[8%] text-red-600 text-xs">
            {t(`${errors.description.message}`)}
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <CustomButton variants="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("Submitting") : t("Save Changes")}
        </CustomButton>
      </div>
    </form>
  );
}
