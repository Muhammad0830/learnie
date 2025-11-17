"use client";
import AddingCourseToTeacher from "@/components/teachers/AddingCourseToTeacher";
import FormCheckDialog from "@/components/teachers/FormCheckDialog";
import TeacherEditForm from "@/components/teachers/TeacherForm";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { TeacherFormData, TeacherSchema } from "@/schemas/teacherSchema";
import { Course, Teacher } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const t = useTranslations("Teachers");
  const toastT = useTranslations("Toast");
  const { id } = useParams();
  const { showToast } = useCustomToast();

  const { data: teacher, isLoading } = useApiQuery<{
    courses: { id: number; name: string }[];
    user: Teacher;
  }>(`/users/${id}`, {
    key: ["teachers"],
  });

  const { data: courses, isLoading: isLoadingCourses } = useApiQuery<Course[]>(
    "/courses",
    { key: "CourseList" }
  );

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
  const router = useRouter();

  useEffect(() => {
    if (teacher) {
      setValue("name", teacher.user.name);
      setValue("email", teacher.user.email);
      if (teacher.user.age) setValue("age", teacher.user.age);
      if (teacher.courses.length > 0) {
        const courseIds = teacher.courses.map((course) => String(course.id));
        setValue("courseIds", courseIds);
      } else setValue("courseIds", []);
      setValue("phoneNumber", teacher.user.phoneNumber);
    }
  }, [teacher, setValue]);

  const { mutate: editTeacher } = useApiMutation<
    { success: boolean },
    TeacherFormData
  >(`/users/${id}`, "put");

  const onSubmit = (data: TeacherFormData) => {
    console.log("Form submitted:", data);

    editTeacher(data, {
      onSuccess: () => {
        reset();
        setIsDialogOpen(false);
        showToast("success", toastT("Teacher edited successfully"));
        router.push("/teachers");
      },
      onError: (error) => {
        console.error("teacher create failed", error);
      },
    });
  };

  const selectedCoursesIds = useWatch({
    control,
    name: "courseIds",
  });

  const selectedCourses = courses?.filter((course) =>
    selectedCoursesIds?.includes(String(course.id))
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Teacher Edit")}
        </h1>
        <Link
          href={"/teachers"}
          className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
        >
          {t("Back to teachers")}
        </Link>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : teacher ? (
        <TeacherEditForm
          onSubmit={handleSubmit(onSubmit)}
          errors={errors}
          register={register}
          control={control}
          setValue={setValue}
          onPhoneValidityChange={setIsPhoneValid}
          editPage
        />
      ) : (
        <div>{t("no teacher found")}</div>
      )}

      {isLoadingCourses ? (
        <div>{t("Loading")}</div>
      ) : courses?.length === 0 ? (
        <div className="mt-10">{t("no courses found")}</div>
      ) : (
        <AddingCourseToTeacher
          isLoading={isLoading}
          courses={courses ?? []}
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
};

export default Page;
