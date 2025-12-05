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

export default function TopicEditPage() {
  const { id: courseId, topicId } = useParams() as {
    id: string;
    topicId: string;
  };
  const router = useRouter();
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();

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
        if (courseId) router.push(`/courses/view/${courseId}`);
        else router.push("/courses");
      },
      onError: (err) => {
        console.error("Failed to update topic", err);
        showToast("error", toastT("Failed to update topic"));
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Edit Topic")}
        </h1>

        <Link
          href={`/courses/view/${courseId}`}
          className="rounded-sm px-3 py-1.5 text-nowrap bg-primary/5 hover:bg-primary/10 border border-primary text-black dark:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="sm:flex hidden">{t("Back to courses")}</span>
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
