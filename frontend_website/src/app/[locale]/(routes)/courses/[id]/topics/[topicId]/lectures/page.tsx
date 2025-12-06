"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

import useApiQuery from "@/hooks/useApiQuery";
import { Lecture } from "@/types/types";

import { ArrowLeft, Plus } from "lucide-react";
import CustomButton from "@/components/ui/customButton";

const TopicLecturesPage = () => {
  const t = useTranslations("Courses");
  const { id, topicId } = useParams();

  const { data: lectures, isLoading } = useApiQuery<Lecture[]>(
    `/courses/lectures/list?topicId=${topicId}`,
    {
      key: ["lecture"],
    }
  );

  if (isLoading) {
    return <div className="my-10">{t("Loading")}...</div>;
  }

  if (!lectures || lectures.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Lectures")}
          </h1>

          <Link href={`/courses/${id}/topics/${topicId}`}>
            <CustomButton
              variants="primary"
              className="px-3 py-1.5 text-sm gap-1 flex items-center flex-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t(`Back`)}</span>
            </CustomButton>
          </Link>
        </div>

        <div className="w-full h-20 border border-primary bg-primary/5 rounded-md flex justify-center items-center">
          {t("No lectures found")}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Lectures")}
        </h1>

        <Link href={`/courses/${id}/topics/${topicId}`}>
          <CustomButton
            variants="primary"
            className="px-3 py-1.5 text-sm gap-1 flex items-center flex-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t(`Back`)}</span>
          </CustomButton>
        </Link>
      </div>

      {/* ADD BUTTON */}
      <div className="flex justify-end mb-4">
        <Link
          href={`/courses/create/lectures?courseId=${id}&topicId=${topicId}`}
        >
          <CustomButton variants="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t("Add New Lecture")}
          </CustomButton>
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {lectures?.map((lec) => (
          <div
            key={lec.id}
            className="border border-primary/50 rounded-md p-4 bg-primary/5"
          >
            <h3 className="text-lg font-semibold">{lec.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{lec.content}</p>

            <div className="mt-3 flex gap-3 text-sm">
              {lec.image_url && (
                <a
                  href={lec.image_url}
                  target="_blank"
                  className="underline text-primary"
                >
                  {t("View Image")}
                </a>
              )}

              {lec.video_url && (
                <a
                  href={lec.video_url}
                  target="_blank"
                  className="underline text-primary"
                >
                  {t("View Video")}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicLecturesPage;
