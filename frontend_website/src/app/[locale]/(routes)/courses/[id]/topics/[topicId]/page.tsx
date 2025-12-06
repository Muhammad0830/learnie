"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import useApiQuery from "@/hooks/useApiQuery";

import {
  EachTopicResponseData,
  Lecture,
  Assignment,
  Presentation,
} from "@/types/types";

import {
  ArrowLeft,
  FilePen,
  Eye,
  Pencil,
  PresentationIcon,
  Trash2,
  Plus,
} from "lucide-react";
import CustomButton from "@/components/ui/customButton";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ContentListItem from "@/components/courses/ContentListItem";

type ContentItem = Lecture | Assignment | Presentation;

const CourseTopicViewPage = () => {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const { id: courseId, topicId } = useParams() as {
    id: string;
    topicId: string;
  };
  const { showToast, showLoadingToast, hideLoadingToast } = useCustomToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const {
    mutate: deleteTopic,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
  } = useApiMutation(
    ({ courseId, topicId }: { courseId: string; topicId: string }) =>
      `/courses/${courseId}/topics/${topicId}`,
    "delete"
  );

  useEffect(() => {
    if (isDeleting) {
      showLoadingToast("Deleting...");
    }
    if (isDeleteSuccess) {
      hideLoadingToast();
      setTimeout(() => {
        setIsDeleteOpen(false);
        showToast("success", toastT("Topic deleted successfully"));
        window.history.back();
      }, 300);
    }
  }, [
    isDeleting,
    isDeleteSuccess,
    showLoadingToast,
    hideLoadingToast,
    showToast,
    toastT,
  ]);

  if (isLoading) {
    return <div className="my-10">{t("Loading")}...</div>;
  }

  if (isError || !topicData) {
    return <div>{t("Failed to load topic or topic not found")}</div>;
  }

  if (!courseId && !topicId) {
    return <div>{t("Failed to to get Course and Topic")}</div>;
  }

  const { course_topic, lectures, assignments, presentations } = topicData;

  const renderContentSection = (
    title: string,
    icon: React.ReactNode,
    contentList: ContentItem[],
    type: "lecture" | "assignment" | "presentation"
  ) => {
    const addHref = `/courses/create/items?pageType=${type}&courseId=${courseId}&topicId=${topicId}`;
    const viewHref = `/courses/${courseId}/topics/${topicId}/${type}s`;

    return (
      <div className="space-y-3 p-4 border border-primary/30 rounded-md bg-primary/5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {icon} {t(title)}
          </h2>
          <div className="flex gap-2 items-center">
            <Link href={viewHref}>
              <CustomButton
                variants="primary"
                className="px-3 py-1.5 max-[400px]:px-2 max-[400px]:py-2 text-sm gap-1 flex items-center flex-nowrap"
              >
                <Eye className="w-4 h-4" />
                <span className="sm:flex hidden">{t(`View all`)}</span>
                <span className="sm:hidden sm-[400px]:flex max-[400px]:hidden">
                  {t(`All`)}
                </span>
              </CustomButton>
            </Link>
            <Link href={addHref}>
              <CustomButton
                variants="primary"
                className="px-3 py-1.5 max-[400px]:px-2 max-[400px]:py-2 text-sm gap-1 flex items-center flex-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="sm:flex hidden">
                  {t(`Add New ${title.slice(0, -1)}`)}
                </span>
                <span className="sm:hidden sm-[400px]:flex max-[400px]:hidden">
                  {t(`New`)}
                </span>
              </CustomButton>
            </Link>
          </div>
        </div>

        {contentList.length === 0 ? (
          <div className="text-muted-foreground">
            {t(`No ${title.toLowerCase()} found`)}
          </div>
        ) : (
          <div className="space-y-2">
            {contentList.map((item) => (
              <ContentListItem
                key={item.id}
                item={item}
                type={type}
                courseId={courseId}
                topicId={topicId}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Topic View")}: {course_topic.title}
        </h1>

        <div className="flex gap-2 items-center">
          <Link
            href={`/courses/view/${courseId}`}
            className="rounded-sm px-3 py-1.5 max-[400px]:py-2.5 text-nowrap bg-primary/5 hover:bg-primary/10 border border-primary text-black dark:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="lg:flex hidden">{t("Back to courses")}</span>
            <span className="lg:hidden max-[400px]:hidden flex">
              {t("Back")}
            </span>
          </Link>
          <Link
            href={`/courses/${courseId}/topics/edit/${course_topic.id}`}
            className="rounded-sm flex gap-2 items-center px-3 py-1.5 max-sm:py-2.5 bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white text-xs sm:text-[16px]"
          >
            <Pencil className="w-4 h-4" />
            <span className="sm:flex hidden">{t("Edit")}</span>
          </Link>
          <CustomButton
            className="flex gap-2 items-center px-3 py-1.5 max-lg:py-2.5 border-red-600/40 dark:border-red-600/20 dark:bg-red-600/5 bg-red-600/20 hover:bg-red-600/30 dark:hover:bg-red-600/15"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="lg:flex hidden">{t("Delete")}</span>
          </CustomButton>
        </div>
      </div>
      {/* TOPIC INFORMATION */}
      <div className="space-y-3 border border-primary rounded-md p-4 bg-primary/5 mb-6">
        <div className="flex gap-1 items-end">
          <p>{t("Title")}:</p>
          <p className="text-lg font-semibold">{course_topic.title}</p>
        </div>

        {course_topic.description && (
          <div>
            <p className="font-semibold">{t("Description")}:</p>
            <p className="text-sm">{course_topic.description}</p>
          </div>
        )}

        <div className="flex sm:flex-row flex-col gap-1 justify-between text-sm text-muted-foreground">
          <p>
            {t("Created At")}:{" "}
            <span className="font-semibold">
              {new Date(course_topic.created_at).toLocaleDateString()}
            </span>
          </p>
          <p>
            {t("Updated At")}:{" "}
            <span className="font-semibold">
              {course_topic.updated_at
                ? new Date(course_topic.updated_at).toLocaleDateString()
                : t("not updated yet")}
            </span>
          </p>
        </div>
      </div>
      {/* CONTENT SECTIONS */}
      <div className="space-y-6">
        {/* Lectures */}
        {renderContentSection(
          "Lectures",
          <Eye className="w-5 h-5" />,
          lectures,
          "lecture"
        )}

        {/* Assignments */}
        {renderContentSection(
          "Assignments",
          <FilePen className="w-5 h-5" />,
          assignments,
          "assignment"
        )}

        {/* Presentations */}
        {renderContentSection(
          "Presentations",
          <PresentationIcon className="w-5 h-5" />,
          presentations,
          "presentation"
        )}
      </div>
      {/* Delete Topic Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="p-4 max-sm:max-w-[90vw]">
          <DialogTitle>{t("Are you sure to delete this topic?")}</DialogTitle>
          <div className="flex flex-col my-2 dark:text-foreground/60 text-foreground/80">
            <p className="text-sm">
              {t("Title")}: {course_topic.title}
            </p>
            <p className="text-sm">
              {t("Description")}: {course_topic.description}
            </p>
            <p className="text-sm text-red-500 font-bold mt-2">
              {t(
                "All associated content (lectures, assignments, presentations) will be lost"
              )}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end">
            <CustomButton
              variants="outline"
              className="flex gap-2 items-center px-6 py-2"
              onClick={() => setIsDeleteOpen(false)}
            >
              <span>{t("Cancel")}</span>
              <ArrowLeft className="w-4 h-4" />
            </CustomButton>

            <CustomButton
              className="flex gap-2 items-center px-6 py-2 border-red-600/40 dark:border-red-600/20 dark:bg-red-600/5 bg-red-600/20 hover:bg-red-600/30 dark:hover:bg-red-600/15"
              onClick={() =>
                deleteTopic({
                  courseId,
                  topicId: String(course_topic.id),
                })
              }
              disabled={isDeleting}
            >
              <span>{t("Delete")}</span>
              <Trash2 className="w-4 h-4" />
            </CustomButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseTopicViewPage;
