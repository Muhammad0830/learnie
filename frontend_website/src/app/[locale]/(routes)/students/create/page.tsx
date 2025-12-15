"use client";
import AddingCourseToStudent from "@/components/students/AddingCourseToStudent";
import FormCheckDialog from "@/components/students/FormCheckDialog";
import StudentForm from "@/components/students/StudentForm";
import CustomButton from "@/components/ui/customButton";
import { useAuth } from "@/context/AuthContext";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { StudentFormData, StudentSchema } from "@/schemas/studentSchema";
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
  const t = useTranslations("Students");
  const toastT = useTranslations("Toast");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    trigger,
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      role: "student",
    },
  });
  const { showToast } = useCustomToast();
  const router = useRouter();
  const { user } = useAuth();

  const { mutate } = useApiMutation<{ success: boolean }, StudentFormData>(
    "/users",
    "post"
  );

  const { data: courses, isLoading } = useApiQuery<CoursesListResponse>(
    "/courses",
    {
      key: "CourseList",
    }
  );

  const onSubmit = (data: StudentFormData) => {
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

  const checkValidity = (value: "email" | "password") => {
    if (value === "password") {
      if (control._formValues.password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        return false;
      } else {
        setPasswordError("");
        return true;
      }
    } else {
      if (!control._formValues.email) {
        setEmailError("Email is required");
        return false;
      } else {
        setEmailError("");
        return true;
      }
    }
  };

  const validateValues = async () => {
    const isValid = await trigger();
    const isPasswordValid = checkValidity("password");
    const isEmailValid = checkValidity("email");
    if (!isPhoneValid) {
      showToast("error", "Invalid phone number");
      return;
    }
    setIsDialogOpen(isValid && isPasswordValid && isEmailValid);
  };

  const selectedCoursesIds = useWatch({
    control,
    name: "courseIds",
  });

  const selectedCourses = courses?.courses.filter((course) =>
    selectedCoursesIds?.includes(String(course.id))
  );

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
  }

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

      <StudentForm
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
        register={register}
        control={control}
        setValue={setValue}
        onPhoneValidityChange={setIsPhoneValid}
        passwordError={passwordError}
        emailError={emailError}
      />

      {courses?.courses.length === 0 ? (
        <div>{t("no courses found")}</div>
      ) : (
        <AddingCourseToStudent
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
        action={"create"}
      />
    </div>
  );
};

export default Page;
