"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { TopicsForCourseFormData } from "@/schemas/topicShema";
import { useTranslations } from "next-intl";

export default function TopicInput({
  index,
  register,
  errors,
  fields,
  remove,
}: {
  index: number;
  register: UseFormRegister<TopicsForCourseFormData>;
  errors: FieldErrors<TopicsForCourseFormData>;
  fields: FieldArrayWithId<
    {
      courseId: number;
      topics: {
        title: string;
        description: string;
      }[];
    },
    "topics",
    "id"
  >[];
  remove: () => void;
}) {
  const t = useTranslations("Courses");

  return (
    <motion.div
      key={`topic-${index}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="border border-primary/30 rounded-md p-3 bg-primary/5"
    >
      <div className="relative mb-3">
        <div className="flex justify-between gap-2 items-center">
          <label className="block font-semibold mb-0.5">
            {t("Topic Title")}
          </label>
          {fields.length > 1 && index > 0 && (
            <button
              type="button"
              onClick={() => remove()}
              className="py-0.5 pb-1 cursor-pointer text-red-500 text-sm hover:underline"
            >
              {t("Remove")}
            </button>
          )}
        </div>
        <input
          type="text"
          {...register(`topics.${index}.title` as const)}
          className={cn(
            "border border-foreground/40 rounded p-2 w-full bg-background-secondary",
            errors?.topics?.[index]?.title && "border-red-600"
          )}
          placeholder={t("Enter topic title")}
        />
        {errors?.topics?.[index]?.title && (
          <p className="text-red-500 text-xs absolute">
            {t(`${errors.topics[index].title.message}`)}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block font-semibold mb-0.5">
          {t("Topic Description")}
        </label>
        <textarea
          {...register(`topics.${index}.description` as const)}
          className={cn(
            "border border-foreground/40 rounded p-2 w-full bg-background-secondary",
            errors?.topics?.[index]?.description && "border-red-600"
          )}
          placeholder={t("Enter topic description")}
        />
        {errors?.topics?.[index]?.description && (
          <p className="text-red-500 text-xs absolute -bottom-[10%]">
            {t(`${errors.topics[index].description.message}`)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
