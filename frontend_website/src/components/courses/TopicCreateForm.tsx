"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TopicItemFormData } from "@/schemas/topicShema";

const TopicCreateForm = ({
  register,
  errors,
  onSubmit,
}: {
  register: UseFormRegister<TopicItemFormData>;
  errors: FieldErrors<TopicItemFormData>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) => {
  const t = useTranslations("Courses");
  return (
    <form className="mt-4" id="course_topic_craete_form" onSubmit={onSubmit}>
      <div className="relative mb-3">
        <label className="block mb-0.5 font-semibold">{t("TopicTitle")}</label>
        <input
          type="text"
          {...register("title")}
          className={cn(
            "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
            errors.title && "border-red-600"
          )}
          placeholder={t("EnterTopicTitle") as string}
        />
        {errors.title && (
          <p className="text-red-500 sm:text-sm absolute text-xs">
            {t(`${errors.title.message}`)}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block mb-0.5 font-semibold">
          {t("TopicDescription")}
        </label>
        <input
          type="text"
          {...register("description")}
          className={cn(
            "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
            errors.description && "border-red-600"
          )}
          placeholder={t("EnterTopicDescription") as string}
        />
        {errors.description && (
          <p className="text-red-500 sm:text-sm absolute text-xs">
            {t(`${errors.description.message}`)}
          </p>
        )}
      </div>
    </form>
  );
};

export default TopicCreateForm;
