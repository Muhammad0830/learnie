"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

import useApiQuery from "@/hooks/useApiQuery";
import { Presentation } from "@/types/types";

import { ArrowLeft, Plus } from "lucide-react";
import CustomButton from "@/components/ui/customButton";

const TopicPresentationsPage = () => {
  const t = useTranslations("Courses");
  const { id, topicId } = useParams();

  const { data: presentations, isLoading } = useApiQuery<Presentation[]>(
    `/courses/presentations/list?topicId=${topicId}`,
    {
      key: ["presentations"],
    }
  );

  if (isLoading) return <div className="my-10">{t("Loading")}...</div>;

  if (!presentations || presentations.length === 0) {
    return (
      <div>
        <div className="flex justify-between mb-4">
          <h1 className="lg:text-3xl text-xl font-bold">
            {t("Presentations")}
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
          {t("No presentations found")}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="lg:text-3xl text-xl font-bold">{t("Presentations")}</h1>
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

      {/* ADD NEW */}
      <div className="flex justify-end mb-4">
        <Link
          href={`/courses/create/presentations?courseId=${id}&topicId=${topicId}`}
        >
          <CustomButton variants="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t("Add New Presentation")}
          </CustomButton>
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {presentations?.map((pres) => (
          <div
            key={pres.id}
            className="border border-primary/50 rounded-md p-4 bg-primary/5 flex lg:flex-row flex-col justify-between lg:items-center"
          >
            <h3 className="lg:text-xl sm:text-lg text-base font-semibold">
              {pres.title}
            </h3>

            <a
              href={pres.file_url}
              target="_blank"
              className="underline text-primary text-sm max-lg:mt-2 inline-block"
            >
              {t("Open File")}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicPresentationsPage;
