"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

import useApiQuery from "@/hooks/useApiQuery";
import { Assignment } from "@/types/types";

import { ArrowLeft, Plus } from "lucide-react";
import CustomButton from "@/components/ui/customButton";

const TopicAssignmentsPage = () => {
  const t = useTranslations("Courses");
  const { id, topicId } = useParams();

  const { data: assignments, isLoading } = useApiQuery<Assignment[]>(
    `/courses/assignments/list?topicId=${topicId}`,
    {
      key: ["assignments"],
    }
  );

  if (isLoading) return <div className="my-10">{t("Loading")}...</div>;

  if (!assignments || assignments.length === 0) {
    return (
      <div>
        <div className="flex justify-between mb-4 items-center">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Assignments")}
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
          {t("No assignments found")}
        </div>
      </div>
    );
  }

  const formatDueDate = (date: string) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-4 items-center">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Assignments")}
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
          href={`/courses/create/items?pageType=assignment&courseId=${id}&topicId=${topicId}`}
        >
          <CustomButton variants="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t("Add New Assignment")}
          </CustomButton>
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {assignments?.length > 0 ? (
          assignments?.map((asn) => (
            <div
              key={asn.id}
              className="border border-primary/50 rounded-md p-4 bg-primary/5 flex md:flex-row flex-col gap-2 justify-between md:items-center"
            >
              <div className="flex lg:flex-row flex-col lg:items-center gap-2 justify-between w-full">
                <div>
                  <h3 className="text-lg font-semibold">{asn.title}</h3>
                  <p className="text-sm mt-1">{asn.description}</p>
                </div>

                <p className="md:text-sm text-xs max-md:mt-2 flex flex-col lg:items-center">
                  <span>{t("Due Date")}: </span>
                  <span className="font-medium">
                    {formatDueDate(asn.due_date)}
                  </span>
                </p>

                <div className="lg:flex hidden">
                  {asn?.images?.length > 0 ? (
                    <div className="mt-3 flex gap-3">
                      {asn?.images?.map((img, i) => (
                        <a
                          key={i}
                          href={img.url}
                          target="_blank"
                          className="underline text-primary text-sm"
                        >
                          {img.title}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div>{t("No image")}</div>
                  )}
                </div>
              </div>

              <div className="lg:hidden block text-nowrap">
                {asn?.images?.length > 0 ? (
                  <div className="mt-3 flex gap-3">
                    {asn?.images?.map((img, i) => (
                      <a
                        key={i}
                        href={img.url}
                        target="_blank"
                        className="underline text-primary text-sm"
                      >
                        {img.title}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div>{t("No image")}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full min-h-[200px] border border-primary rounded-md flex justify-center items-center">
            {t("No assignments found")}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicAssignmentsPage;
