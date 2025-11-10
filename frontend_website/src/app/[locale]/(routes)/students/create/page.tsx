"use client";
import AddingCourseToStudent from "@/components/students/AddingCourseToStudent";
import FormCheckDialog from "@/components/students/FormCheckDialog";
import StudentCreateForm from "@/components/students/StudentCreateForm";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { StudentFormData, studentSchema } from "@/schemas/studentSchema";
import { Course } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const t = useTranslations("Students");
  const toastT = useTranslations("Toast");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    trigger,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      role: "student",
    },
  });
  const { showToast } = useCustomToast();
  const router = useRouter();

  const { mutate } = useApiMutation<{ success: boolean }, StudentFormData>(
    "/users",
    "post"
  );

  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useApiQuery<Course[]>("/courses", { key: "CourseList" });

  const onSubmit = (data: StudentFormData) => {
    console.log("Form submitted:", data);

    mutate(data, {
      onSuccess: () => {
        reset();
        setIsDialogOpen(false);
        showToast("success", toastT("Student created successfully"));
        router.push("/students");
      },
      onError: (error) => {
        console.error("student create failed", error);
      },
    });
  };

  if (isError) {
    showToast("error", toastT("Error Fetching Courses"));
    console.error("Error fetching courses:", error);
  }

  const selectedCoursesIds = useWatch({
    control,
    name: "coursesIds",
  });

  const selectedCourses = courses?.filter((course) =>
    selectedCoursesIds?.includes(String(course.id))
  );

  console.log("selectedCoursesIds", selectedCoursesIds);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Create New Student")}
        </h1>

        <Link
          href={"/students"}
          className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
        >
          {t("Back")}
        </Link>
      </div>

      <StudentCreateForm
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
        register={register}
        control={control}
        setValue={setValue}
        onPhoneValidityChange={setIsPhoneValid}
      />

      <AddingCourseToStudent
        isLoading={isLoading}
        courses={courses ?? []}
        selectedCoursesIds={selectedCoursesIds}
        setValue={setValue}
      />

      <button
        type="button"
        onClick={async () => {
          const isValid = await trigger();
          if (!isPhoneValid) {
            showToast("error", "Invalid phone number");
            return;
          }
          setIsDialogOpen(isValid);
        }}
        className="mt-4 cursor-pointer px-3 py-1.5 rounded-sm bg-primary/20 hover:bg-primary/30 transition-colors duration-150 border border-primary"
      >
        {t("Submit")}
      </button>

      <FormCheckDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        control={control}
        selectedCourses={selectedCourses ?? []}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Page;
