"use client";
import { Assignment, Lecture, Presentation, Topic } from "@/types/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { FilePen, MonitorPlay, PresentationIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const CourseTopicsItem = ({
  topic,
}: {
  topic: {
    course_topics: Topic;
    assignments: Assignment[];
    lectures: Lecture[];
    presentations: Presentation[];
  };
}) => {
  const t = useTranslations("Courses");

  console.log("topic", topic);

  return (
    <AccordionItem
      key={topic.course_topics.id}
      value={`${topic.course_topics.id}`}
      className="border-b-0"
    >
      <AccordionTrigger className="w-full flex items-center justify-between p-3 font-semibold cursor-pointer border border-primary bg-[#ffffff] dark:bg-[#000000] rounded-md relative overflow-hidden py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
        <span className="z-1">{topic.course_topics.title}</span>
        <div className="bg-primary/5 absolute inset-0 z-0" />
      </AccordionTrigger>
      <AccordionContent className="py-1">
        <div className="p-4 space-y-4 bg-primary/10 rounded-md border border-primary/30">
          {/* Topic description */}
          {topic.course_topics.description && (
            <p className="text-sm">{topic.course_topics.description}</p>
          )}

          <div className="space-y-4 grid lg:grid-cols-3 gap-2">
            {/* Lectures */}
            <div className="lg:border-r border-primary/30 h-full">
              <div className="flex justify-between items-center pr-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <MonitorPlay className="w-4 h-4" /> {t("Lectures")}
                </h4>
                <Link
                  href={`/courses/${topic.course_topics.course_id}/topics/${topic.course_topics.id}/lectures`}
                  className="px-2 py-0.5 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                >
                  {"View all"}
                </Link>
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
                <Link
                  href={`/courses/${topic.course_topics.course_id}/topics/${topic.course_topics.id}/presentations`}
                  className="px-2 py-0.5 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                >
                  {"View all"}
                </Link>
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
                <Link
                  href={`/courses/${topic.course_topics.course_id}/topics/${topic.course_topics.id}/assignments`}
                  className="px-2 py-0.5 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                >
                  {"View all"}
                </Link>
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
    </AccordionItem>
  );
};

export default CourseTopicsItem;
