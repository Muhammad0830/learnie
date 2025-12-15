"use client";
import CourseCreateForm from "@/components/courses/CourseCreateForm";
import TopicCreateForm from "@/components/courses/TopicCreateForm";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { CourseFormData, CourseSchema } from "@/schemas/courseSchema";
import { TopicItemFormData, TopicItemSchema } from "@/schemas/topicShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import CustomButton from "@/components/ui/customButton";
import { useAuth } from "@/context/AuthContext";

interface CourseWithTopicResponse {
  courseId: boolean;
  topicId: boolean;
  courseTitle: boolean;
  courseDescription: boolean;
  topicTitle: boolean;
  topicDescription: boolean;
}

interface CourseWithTopicFormData extends CourseFormData {
  topicTitle: string;
  topicDescription: string;
}

const Page = () => {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");

  const { showToast } = useCustomToast();
  const [courseAdd, setCourseAdd] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
    control,
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
  });

  const formValues = control._formValues;

  const {
    register: topicRegister,
    handleSubmit: topicHandleSubmit,
    formState: { errors: topicErrors, isSubmitting: isTopicSubmitting },
    reset: topicReset,
    trigger: topicTrigger,
  } = useForm<TopicItemFormData>({
    resolver: zodResolver(TopicItemSchema),
  });

  const { mutate } = useApiMutation<{ id: number }, CourseFormData>(
    "/courses",
    "post"
  );

  const { mutate: addTopicWithCourse } = useApiMutation<
    CourseWithTopicResponse,
    CourseWithTopicFormData
  >(`/courses/coursestopics`, "post");

  const onSubmit = (data: CourseFormData) => {
    if (!courseAdd) {
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
    }
  };

  const onTopicSubmit = (data: TopicItemFormData) => {
    addTopicWithCourse(
      {
        name: formValues.name,
        description: formValues.description,
        topicTitle: data.title,
        topicDescription: data.description,
      },
      {
        onSuccess: () => {
          reset();
          topicReset();
          showToast("success", toastT("Course created successfully"));
          showToast("success", toastT("Topic created successfully"));
          router.push("/courses");
        },
        onError: (error) => {
          console.error("course or topic create failed", error);
        },
      }
    );
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
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Create New Course")}
          </h1>

          <Link
            href={"/courses"}
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

        <AnimatePresence key="animate_presence_course_create">
          {courseAdd && (
            <motion.div
              key="course_topic_craete_form_wrapper"
              initial={{ opacity: 0, y: -30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.3,
                  delay: 0.1,
                  ease: "easeInOut",
                  type: "tween",
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                transition: { duration: 0.1, ease: "easeInOut", type: "tween" },
              }}
            >
              <TopicCreateForm
                register={topicRegister}
                errors={topicErrors}
                onSubmit={topicHandleSubmit(onTopicSubmit)}
              />
            </motion.div>
          )}

          <motion.button
            layout
            type="submit"
            form={courseAdd ? "course_topic_craete_form" : "course_create_form"}
            key="course_create_button"
            onClick={async () => {
              await trigger();
              if (courseAdd) await topicTrigger();
            }}
            className="mt-6 cursor-pointer px-3 py-1.5 rounded-sm bg-primary/20 hover:bg-primary/30 transition-colors duration-150 border border-primary"
          >
            {isSubmitting || isTopicSubmitting ? t("Submitting") : t("Submit")}
          </motion.button>
        </AnimatePresence>
      </div>
    );
  }
};

export default Page;
