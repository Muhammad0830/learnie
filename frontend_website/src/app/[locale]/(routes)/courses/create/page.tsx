"use client";
import CourseCreateForm from "@/components/courses/CourseCreateForm";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { CourseFormData, CourseSchema } from "@/schemas/courseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();
  const router = useRouter();
  const [courseAdd, setCourseAdd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
  });

  const { mutate } = useApiMutation<{ success: boolean }, CourseFormData>(
    "/courses",
    "post"
  );

  const onSubmit = (data: CourseFormData) => {
    console.log("Form submitted:", data);

    mutate(data, {
      onSuccess: () => {
        reset();
        showToast("success", toastT("Course created successfully"));
        router.push("/courses");
      },
      onError: (error) => {
        console.error("course create failed", error);
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Create New Course")}
        </h1>

        <Link
          href={"/students"}
          className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
        >
          {t("Back to courses")}
        </Link>
      </div>

      {/* course form */}
      <CourseCreateForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        setCourseAdd={setCourseAdd}
        courseAdd={courseAdd}
      />

      <button
        type="submit"
        form="course_create_form"
        onClick={async () => await trigger()}
        className="mt-4 cursor-pointer px-3 py-1.5 rounded-sm bg-primary/20 hover:bg-primary/30 transition-colors duration-150 border border-primary"
      >
        {t("Submit")}
      </button>
    </div>
  );
};

export default Page;
