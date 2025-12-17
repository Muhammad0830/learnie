"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import TopicEditForm from "@/components/courses/forms/TopicEditForm";
import { TopicItemFormData, TopicItemSchema } from "@/schemas/topicShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EachTopicResponseData } from "@/types/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CustomButton from "@/components/ui/customButton";
import { useAuth } from "@/context/AuthContext";

export default function TopicEditPage() {
  const { id: courseId, topicId } = useParams() as {
    id: string;
    topicId: string;
  };
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");

  const { showToast } = useCustomToast();
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: topicData,
    isLoading,
    isError,
  } = useApiQuery<EachTopicResponseData>(
    `/courses/${courseId}/topics/${topicId}`,
    {
      key: ["courseTopic", courseId, topicId],
    }
  );

  const { mutate, isPending: isMutating } = useApiMutation<
    { id: string; title: string; description: string },
    TopicItemFormData
  >(`/courses/topics/${topicId}`, "put");

  const form = useForm<TopicItemFormData>({
    resolver: zodResolver(TopicItemSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (topicData) {
      reset({
        title: topicData?.course_topic.title ?? "",
        description: topicData?.course_topic.description ?? "",
      });
    }
  }, [topicData, reset]);

  if (!topicId) {
    return <div className="py-8">{t("Invalid topic id")}</div>;
  }
  if (!courseId) {
    return <div className="py-8">{t("Invalid course id")}</div>;
  }
  if (isLoading) {
    return <div className="py-8">{t("Loading")}...</div>;
  }
  if (isError) {
    showToast("error", toastT("Error Fetching Topic"));
    return <div className="py-8">{t("Error Fetching Topic")}</div>;
  }

  const onSubmit = (data: TopicItemFormData) => {
    mutate(data, {
      onSuccess: () => {
        showToast("success", toastT("Topic updated successfully"));
        if (courseId && topicId)
          router.push(`/courses/${courseId}/topics/${topicId}`);
        else if (courseId) router.push(`/courses/${courseId}/view`);
        else router.push("/courses");
      },
      onError: (err) => {
        console.error("Failed to update topic", err);
        showToast("error", toastT("Failed to update topic"));
      },
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        {t("Loading")}
      </div>
    );
  }

  if (!topicId) {
    return (
      <div className="my-10">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Assignments")}
          </h1>
          <Link href={`/courses`}>
            <CustomButton
              variants="primary"
              className="px-3 py-1.5 text-sm gap-1 flex items-center flex-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t(`Back to courses`)}</span>
            </CustomButton>
          </Link>
        </div>

        <div className="w-full h-[100px] border border-primary rounded-sm bg-primary/5 flex justify-center items-center">
          {t("Invalid topic id")}
        </div>
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
            {t("Edit Topic")}
          </h1>

          <Link
            href={`/courses/${courseId}/view`}
            className="rounded-sm px-3 py-1.5 text-nowrap bg-primary/5 hover:bg-primary/10 border border-primary text-black dark:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sm:flex hidden">{t("Back to course")}</span>
            <span className="lg:hidden flex">{t("Back")}</span>
          </Link>
        </div>

        <TopicEditForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isMutating}
        />
      </div>
    );
  }
}
