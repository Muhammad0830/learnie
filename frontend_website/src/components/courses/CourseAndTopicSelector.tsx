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
import { useEffect, useRef } from "react";

type FormType = LectureFormType | AssignmentFormType | PresentationFormType;

export default function CourseAndTopicSelector({
  errors,
  selectedCourseId,
  setValue,
  selectedTopicId,
  setSelectedCourse,
  setSelectedTopic,
}: {
  errors: FieldErrors<FormType>;
  selectedCourseId: number | null | undefined;
  setValue: UseFormSetValue<FormType>;
  selectedTopicId: string;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  setSelectedTopic: React.Dispatch<React.SetStateAction<Topic | null>>;
}) {
  const { data: courses, isLoading } = useApiQuery<{ courses: Course[] }>(
    "/courses",
    {
      key: ["courses"],
    }
  );

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

  const prevCourseId = useRef<string | null>(null);

  useEffect(() => {
    const currentId = selectedCourseId ? String(selectedCourseId) : null;

    // First render: store the initial courseId and do NOT reset
    if (prevCourseId.current === null) {
      prevCourseId.current = currentId;
    } else {
      // Reset ONLY when user changes the course
      if (prevCourseId.current !== currentId) {
        setValue("topicId", "");
        setSelectedTopic(null);
      }
      prevCourseId.current = currentId;
    }

    const selectedCourse = courses?.courses?.find(
      (c) => Number(c.id) === Number(currentId)
    );
    if (selectedCourse) {
      setSelectedCourse(selectedCourse);
    }
  }, [
    selectedCourseId,
    courses,
    setValue,
    setSelectedCourse,
    setSelectedTopic,
  ]);

  useEffect(() => {
    if (selectedTopicId) {
      const selectedTopic = topics?.find(
        (t) => Number(t.id) === Number(selectedTopicId)
      );

      if (selectedTopic) {
        setSelectedTopic(selectedTopic);
      }
    }
  }, [selectedTopicId, setSelectedTopic, topics]);

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
