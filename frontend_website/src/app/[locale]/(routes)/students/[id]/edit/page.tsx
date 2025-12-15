"use client";
import AddingCourseToStudent from "@/components/students/AddingCourseToStudent";
import FormCheckDialog from "@/components/students/FormCheckDialog";
import StudentEditForm from "@/components/students/StudentForm";
import CustomButton from "@/components/ui/customButton";
import { useAuth } from "@/context/AuthContext";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { StudentFormData, StudentSchema } from "@/schemas/studentSchema";
import { CoursesListResponse, Student } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const t = useTranslations("Students");
  const toastT = useTranslations("Toast");
  const { id } = useParams();
  const { showToast } = useCustomToast();

  const { user } = useAuth();
  const router = useRouter();

  const { data: student, isLoading } = useApiQuery<{
    courses: { id: number; name: string }[];
    user: Student;
  }>(`/users/${id}`, {
    key: ["students"],
  });

  const { data: courses, isLoading: isLoadingCourses } =
    useApiQuery<CoursesListResponse>("/courses", { key: "CourseList" });

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

  useEffect(() => {
    if (student) {
      setValue("name", student.user.name);
      setValue("studentId", student.user.studentId);
      if (student.user.age) setValue("age", student.user.age);
      if (student.courses.length > 0) {
        const courseIds = student.courses.map((course) => String(course.id));
        setValue("courseIds", courseIds);
      } else setValue("courseIds", []);
      setValue("phoneNumber", student.user.phoneNumber);
    }
  }, [student, setValue]);

  const { mutate: editStudent } = useApiMutation<
    { success: boolean },
    StudentFormData
  >(`/users/${id}`, "put");

  const onSubmit = (data: StudentFormData) => {
    editStudent(data, {
      onSuccess: () => {
        reset();
        setIsDialogOpen(false);
        showToast("success", toastT("Student edited successfully"));
        router.push(`/students/${id}/view`);
      },
      onError: (error) => {
        console.error("student create failed", error);
      },
    });
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
  } else {
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-full">
          {t("Loading")}
        </div>
      );

    return (
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Student Edit")}
          </h1>
          <Link
            href={"/students"}
            className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
          >
            {t("Back to students")}
          </Link>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : student ? (
          <StudentEditForm
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            register={register}
            control={control}
            setValue={setValue}
            onPhoneValidityChange={setIsPhoneValid}
            editPage
          />
        ) : (
          <div>{t("no student found")}</div>
        )}

        {isLoadingCourses ? (
          <div>{t("Loading")}</div>
        ) : courses?.courses?.length === 0 ? (
          <div className="mt-10">{t("no courses found")}</div>
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
          isSubmitting={isSubmitting}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          control={control}
          selectedCourses={selectedCourses ?? []}
          action={"edit"}
        />
      </div>
    );
  }
};

export default Page;
