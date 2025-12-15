"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TopicsForCourseSchema,
  TopicsForCourseFormData,
} from "@/schemas/topicShema";

import { useTranslations } from "next-intl";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";

import TopicInput from "@/components/courses/TopicInput";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomToast } from "@/context/CustomToastContext";
import { Course } from "@/types/types";
import CustomButton from "@/components/ui/customButton";
import CourseSelectDropdown from "@/components/courses/CourseSelectDropdown";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CreateTopicsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");

  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { showToast } = useCustomToast();
  const { user } = useAuth();
  const router = useRouter();

  const { data: coursesData } = useApiQuery<{ courses: Course[] }>("/courses", {
    key: ["all-courses"],
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
    reset,
  } = useForm<TopicsForCourseFormData>({
    resolver: zodResolver(TopicsForCourseSchema),
    defaultValues: {
      courseId: undefined,
      topics: [
        {
          title: "",
          description: "",
        },
      ],
    },
  });

  useEffect(() => {
    if (courseId) {
      // eslint-disable-next-line
      setSelectedCourseId(Number(courseId));
      setValue("courseId", Number(courseId));
    }
  }, [courseId, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "topics",
  });

  const { mutate } = useApiMutation("/courses/topics", "post");

  const onSubmit = (data: TopicsForCourseFormData) => {
    mutate(
      { ...data, courseId: Number(data.courseId) },
      {
        onSuccess: () => {
          showToast("success", toastT("Topics created successfully"));
          router.push(`/courses/${data.courseId}/view`);
          reset();
        },
        onError: () => {
          showToast("error", toastT("Failed to create topics"));
        },
      }
    );
  };

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setValue("courseId", courseId);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        {t("Loading")}
      </div>
    );
  }

  if (user?.role === "student" || user?.role === "teacher") {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <div className="sm:text-2xl text-xl font-bold">
          {t("You are not authorized to view this page")}
        </div>
        <CustomButton
          onClick={() => {
            router.back();
          }}
          variants="outline"
        >
          {t("Go back")}
        </CustomButton>
      </div>
    );
  } else {
    return (
      <div className="">
        <motion.div layout className="space-y-4 relative overflow-hidden">
          <motion.div layout key={"create_topics_top"}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="md:text-3xl sm:text-2xl text-xl font-bold">
                {t("Create Topics")}
              </h1>

              <Link
                href="/courses"
                className="px-3 py-1.5 max-sm:text-sm rounded border border-primary bg-primary/10 hover:bg-primary/20"
              >
                {t("Back to courses")}
              </Link>
            </div>

            <CourseSelectDropdown
              coursesData={coursesData}
              errors={errors}
              selectedCourseId={selectedCourseId}
              handleSelectCourse={handleSelectCourse}
            />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0, ease: "easeOut" },
                }}
                className="relative"
              >
                <TopicInput
                  index={index}
                  register={register}
                  errors={errors}
                  fields={fields}
                  remove={() => remove(index)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div layout className="flex justify-start gap-2 mt-4">
            <CustomButton
              type="button"
              onClick={() => append({ title: "", description: "" })}
              variants="outline"
            >
              + {t("Add another topic")}
            </CustomButton>

            <CustomButton
              variants="primary"
              type="submit"
              form="topics_form"
              onClick={async () => trigger()}
            >
              {isSubmitting ? t("Submitting") : t("Submit")}
            </CustomButton>
          </motion.div>
        </motion.div>

        <form id="topics_form" onSubmit={handleSubmit(onSubmit)} />
      </div>
    );
  }
}
