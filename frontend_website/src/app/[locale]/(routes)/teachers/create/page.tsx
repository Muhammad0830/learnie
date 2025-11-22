"use client";
import AddingCourseToTeacher from "@/components/teachers/AddingCourseToTeacher";
import FormCheckDialog from "@/components/teachers/FormCheckDialog";
import TeacherForm from "@/components/teachers/TeacherForm";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { TeacherFormData, TeacherSchema } from "@/schemas/teacherSchema";
import { CoursesListResponse } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const t = useTranslations("Teachers");
  const toastT = useTranslations("Toast");
  const [passwordError, setPasswordError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    trigger,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      role: "teacher",
    },
  });
  const { showToast } = useCustomToast();
  const router = useRouter();

  const { mutate } = useApiMutation<{ success: boolean }, TeacherFormData>(
    "/users",
    "post"
  );

  const { data: courses, isLoading } = useApiQuery<CoursesListResponse>(
    "/courses",
    {
      key: "CourseList",
    }
  );

  const onSubmit = (data: TeacherFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setIsDialogOpen(false);
        showToast("success", toastT("Teacher created successfully"));
        router.push("/teachers");
      },
      onError: (error) => {
        console.error("teacher create failed", error);
      },
    });
  };

  const validateValues = async () => {
    const isValid = await trigger();
    let isPasswordValid;
    if (control._formValues.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isPasswordValid = false;
    } else {
      setPasswordError("");
      isPasswordValid = true;
    }
    if (!isPhoneValid) {
      showToast("error", "Invalid phone number");
      return;
    }
    setIsDialogOpen(isValid && isPasswordValid);
  };

  const selectedCoursesIds = useWatch({
    control,
    name: "courseIds",
  });

  const selectedCourses = courses?.courses.filter((course) =>
    selectedCoursesIds?.includes(String(course.id))
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Create New Teacher")}
        </h1>

        <Link
          href={"/teachers"}
          className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
        >
          {t("Back")}
        </Link>
      </div>

      <TeacherForm
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
        register={register}
        control={control}
        setValue={setValue}
        onPhoneValidityChange={setIsPhoneValid}
        passwordError={passwordError}
      />

      {courses?.courses.length === 0 ? (
        <div>{t("no courses found")}</div>
      ) : (
        <AddingCourseToTeacher
          isLoading={isLoading}
          courses={courses?.courses ?? []}
          selectedCoursesIds={selectedCoursesIds}
          setValue={setValue}
        />
      )}

      <button
        type="button"
        onClick={async () => await validateValues()}
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
        action="create"
      />
    </div>
  );
};

export default Page;
