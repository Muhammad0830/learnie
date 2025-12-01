"use client";

import useApiQuery from "@/hooks/useApiQuery";
import {
  AssignmentFormType,
  LectureFormType,
  PresentationFormType,
} from "@/schemas/courseItemsSchema";
import { Course, Topic } from "@/types/types";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import CourseSelectDropdown from "./CourseSelectDropdown";
import TopicSelectDropdown from "./TopicSelectDropdown";
import { useEffect } from "react";

type FormType = LectureFormType | AssignmentFormType | PresentationFormType;

export default function CourseAndTopicSelector({
  errors,
  selectedCourseId,
  setValue,
  selectedTopicId,
}: {
  errors: FieldErrors<FormType>;
  selectedCourseId: number | null | undefined;
  setValue: UseFormSetValue<FormType>;
  selectedTopicId: string;
}) {
  const { data: courses, isLoading } = useApiQuery<{ courses: Course[] }>(
    "/courses",
    {
      key: ["courses"],
    }
  );

  useEffect(() => {
    setValue("topicId", "");
  }, [selectedCourseId, setValue]);

  const selectedCourse = courses?.courses?.find(
    (c) => Number(c.id) === Number(selectedCourseId)
  );

  const isSelectedCourseIdValid =
    Boolean(selectedCourseId) &&
    selectedCourse?.topics_count &&
    selectedCourse?.topics_count > 0;

  const { data: topics, isLoading: isLoadingTopics } = useApiQuery<Topic[]>(
    isSelectedCourseIdValid ? `/courses/${selectedCourseId}/topics` : null,
    {
      key: ["topics", selectedCourseId as number],
      enabled: Boolean(isSelectedCourseIdValid),
    }
  );

  const handleSelectCourse = (courseId: number) => {
    setValue("courseId", String(courseId));
  };

  const handleSelectTopic = (topicId: number) => {
    setValue("topicId", String(topicId));
  };

  return (
    <div className="space-y-0">
      <CourseSelectDropdown
        coursesData={courses}
        errors={errors}
        selectedCourseId={Number(selectedCourseId)}
        handleSelectCourse={handleSelectCourse}
        className="min-w-[200px]"
        isLoading={isLoading}
      />

      <TopicSelectDropdown
        topics={topics}
        errors={errors}
        selectedTopicId={Number(selectedTopicId)}
        handleSelectTopic={handleSelectTopic}
        className="min-w-[200px]"
        isLoading={isLoadingTopics}
        selectedCourseId={selectedCourseId}
      />
    </div>
  );
}
