"use client";
import { Assignment, Lecture, Presentation, Topic } from "@/types/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Eye,
  FilePen,
  MonitorPlay,
  Pencil,
  PresentationIcon,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import CustomButton from "../ui/customButton";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";

const CourseTopicsItem = ({
  topic,
  courseId,
  refetch,
}: {
  topic: {
    course_topic: Topic;
    assignments: Assignment[];
    lectures: Lecture[];
    presentations: Presentation[];
  };
  refetch: () => void;
  courseId: string;
}) => {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const [isOpen, setIsOpen] = useState(false);
  const { showToast, showLoadingToast, hideLoadingToast } = useCustomToast();

  const {
    mutate: deleteTopic,
    isPending: isDeleting,
    isSuccess,
  } = useApiMutation(
    ({ courseId, topicId }: { courseId: string; topicId: string }) =>
      `/courses/${courseId}/topics/${topicId}`,
    "delete"
  );

  useEffect(() => {
    if (isDeleting) {
      showLoadingToast("Deleting...");
    }
  }, [isDeleting, showLoadingToast]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      hideLoadingToast();
      setTimeout(() => {
        setIsOpen(false);
        showToast("success", toastT("Topic deleted successfully"));
      }, 300);
    }
  }, [isSuccess]); // eslint-disable-line

  return (
    <AccordionItem
      key={topic.course_topic.id}
      value={`${topic.course_topic.id}`}
      className="border-b-0"
    >
      <div className="w-full flex items-center justify-between p-3 font-semibold border border-primary bg-[#ffffff] dark:bg-[#000000] rounded-sm relative overflow-hidden py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
        <div className="flex-1 flex justify-between items-center relative z-1">
          <span className="z-1">{topic.course_topic.title}</span>

          <div className="flex gap-2 items-center">
            {/* view */}
            <Link
              href={`/courses/${courseId}/topics/${topic.course_topic.id}`}
            >
              <CustomButton
                variants="outline"
                className="max-lg:px-2 max-lg:py-2 flex gap-2 items-center"
              >
                <Eye className="w-4 h-4" />
                <span className="max-lg:hidden flex">{t("View")}</span>
              </CustomButton>
            </Link>

            {/* edit */}
            <Link
              href={`/courses/${courseId}/topics/${topic.course_topic.id}/edit`}
            >
              <CustomButton
                variants="outline"
                className="max-lg:px-2 max-lg:py-2 flex gap-2 items-center"
              >
                <Pencil className="w-4 h-4" />
                <span className="max-lg:hidden flex">{t("Edit")}</span>
              </CustomButton>
            </Link>

            {/* delete */}
            <CustomButton
              variants="outline"
              className="px-2 py-2 flex gap-2 items-center border-red-600/40 bg-red-600/20 hover:bg-red-600/30 dark:border-red-600/20 dark:bg-red-600/5 dark:hover:bg-red-600/10"
              onClick={() => setIsOpen(true)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </CustomButton>

            {/* accordion trigger */}
            <div className="flex items-center justify-center px-0 py-0 hover:bg-primary/5 cursor-default border border-primary rounded-sm bg-primary/5">
              <AccordionTrigger className="px-2 py-2 flex items-center justify-center cursor-pointer hover:bg-primary/5" />
            </div>
          </div>
        </div>
        <div className="bg-primary/5 absolute inset-0 z-0" />
      </div>
      <AccordionContent className="py-1">
        <div className="p-4 space-y-4 bg-primary/10 rounded-md border border-primary/30">
          {/* Topic description */}
          {topic.course_topic.description && (
            <p className="text-sm">{topic.course_topic.description}</p>
          )}

          <div className="space-y-4 grid lg:grid-cols-3 gap-2">
            {/* Lectures */}
            <div className="lg:border-r border-primary/30 h-full">
              <div className="flex justify-between items-center pr-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <MonitorPlay className="w-4 h-4" /> {t("Lectures")}
                </h4>
                {topic.lectures?.length ? (
                  <Link
                    href={`/courses/${topic.course_topic.course_id}/topics/${topic.course_topic.id}/lectures`}
                    className="px-2 py-0.5 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                  >
                    {"View all"}
                  </Link>
                ) : null}
              </div>
              {topic.lectures?.length ? (
                <ul className="ml-6 list-disc space-y-1">
                  {topic.lectures.map((lec, index) => {
                    if (index < 5)
                      return (
                        <li key={lec.id}>
                          <Link
                            href={`/lectures/${lec.id}`}
                            className="text-primary underline"
                          >
                            {lec.title}
                          </Link>
                        </li>
                      );
                  })}
                </ul>
              ) : (
                <p className="text-sm">{t("no lectures found")}</p>
              )}
            </div>

            {/* Presentations */}
            <div className="lg:border-r border-primary/30 h-full">
              <div className="flex items-center justify-between pr-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <PresentationIcon className="w-4 h-4" /> {t("Presentations")}
                </h4>
                {topic.presentations?.length ? (
                  <Link
                    href={`/courses/${topic.course_topic.course_id}/topics/${topic.course_topic.id}/presentations`}
                    className="px-2 py-0.5 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                  >
                    {"View all"}
                  </Link>
                ) : null}
              </div>
              {topic.presentations?.length ? (
                <ul className="ml-6 list-disc space-y-1">
                  {topic.presentations.map((pres, index) => {
                    if (index < 5)
                      return (
                        <li key={pres.id}>
                          <Link
                            href={pres.file_url}
                            target="_blank"
                            className="text-primary underline"
                          >
                            {pres.title}
                          </Link>
                        </li>
                      );
                  })}
                </ul>
              ) : (
                <p className="text-sm">{t("no presentations found")}</p>
              )}
            </div>

            {/* Assignments */}
            <div>
              <div className="flex items-center justify-between pr-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FilePen className="w-4 h-4" /> {t("Assignments")}
                </h4>
                {topic.assignments.length ? (
                  <Link
                    href={`/courses/${topic.course_topic.course_id}/topics/${topic.course_topic.id}/assignments`}
                    className="px-2 py-0.5 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                  >
                    {"View all"}
                  </Link>
                ) : null}
              </div>
              {topic.assignments?.length ? (
                <ul className="ml-6 list-disc space-y-1">
                  {topic.assignments.map((as, index) => {
                    if (index < 5)
                      return (
                        <li key={as.id}>
                          <Link
                            href={`/assignments/${as.id}`}
                            className="text-primary underline"
                          >
                            {as.title}
                          </Link>
                        </li>
                      );
                  })}
                </ul>
              ) : (
                <p className="text-sm">{t("no assignments found")}</p>
              )}
            </div>
          </div>
        </div>
      </AccordionContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-4 max-sm:max-w-[90vw]">
          <DialogTitle>{t("Are you sure to delete this topic?")}</DialogTitle>
          <div className="flex flex-col my-2 dark:text-foreground/60 text-foreground/80">
            <p className="text-sm">
              {t("Title")}: {topic.course_topic.title}
            </p>
            <p className="text-sm">
              {t("Description")}: {topic.course_topic.description}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end">
            <CustomButton
              variants="outline"
              className="flex gap-2 items-center px-6 py-2"
              onClick={() => setIsOpen(false)}
            >
              <span>{t("Cancel")}</span>
              <X className="w-4 h-4" />
            </CustomButton>

            <CustomButton
              variants="primary"
              className="flex gap-2 items-center px-6 py-2"
              onClick={() =>
                deleteTopic({
                  courseId,
                  topicId: String(topic.course_topic.id),
                })
              }
            >
              <span>{t("Delete")}</span>
              <Trash2 className="w-4 h-4" />
            </CustomButton>
          </div>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};

export default CourseTopicsItem;
