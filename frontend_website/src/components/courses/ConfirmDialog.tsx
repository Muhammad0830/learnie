"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AssignmentFormType,
  FormType,
  LectureFormType,
  PresentationFormType,
} from "@/schemas/courseItemsSchema";
import { Course, Topic } from "@/types/types";
import { useTranslations } from "next-intl";
import CustomButton from "../ui/customButton";

function isLecture(data: FormType): data is LectureFormType {
  return "content" in data; // only lecture has "content"
}

function isAssignment(data: FormType): data is AssignmentFormType {
  return "description" in data; // only assignment has "description"
}

function isPresentation(data: FormType): data is PresentationFormType {
  return "file_url" in data; // only presentation has "file_url"
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  data,
  selectedCourse,
  selectedTopic,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: FormType | null;
  selectedCourse: Course | null;
  selectedTopic: Topic | null;
}) {
  const t = useTranslations("Courses");

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Confirm creation")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {isLecture(data) && (
            <>
              <p>
                {t("Course")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {selectedCourse?.name || data.courseId}
                </span>
              </p>
              <p>
                {t("Topic")}:{" "}
                {data.topicId || selectedTopic ? (
                  <span className="px-2 py-0.5 bg-primary/20 rounded">
                    {selectedTopic?.title || data.topicId}
                  </span>
                ) : (
                  <span className="text-primary">
                    {t("topic is not selected")}
                  </span>
                )}
              </p>
              <p>
                {t("Title")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {data.title}
                </span>
              </p>
              <p>
                {t("Content")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {data.content}
                </span>
              </p>
              <p>
                {t("Image URL")}:{" "}
                {data.image_url ? (
                  <span className="px-2 py-0.5 bg-primary/20 rounded">
                    {data.image_url}
                  </span>
                ) : (
                  <span className="text-primary">
                    {t("image is not selected")}
                  </span>
                )}
              </p>
              <p>
                {t("Video URL")}:{" "}
                {data.video_url ? (
                  <span className="px-2 py-0.5 bg-primary/20 rounded">
                    {data.video_url}
                  </span>
                ) : (
                  <span className="text-primary">
                    {t("video is not selected")}
                  </span>
                )}
              </p>
            </>
          )}
          {isAssignment(data) && (
            <>
              <p>
                {t("Course")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {selectedCourse?.name || data.courseId}
                </span>
              </p>
              <p>
                {t("Topic")}:{" "}
                {data.topicId || selectedTopic ? (
                  <span className="px-2 py-0.5 bg-primary/20 rounded">
                    {selectedTopic?.title || data.topicId}
                  </span>
                ) : (
                  <span className="text-primary">
                    {t("topic is not selected")}
                  </span>
                )}
              </p>
              <p>
                {t("Title")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {data.title}
                </span>
              </p>
              <p>
                {t("Description")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {data.description}
                </span>
              </p>
              <p>
                {t("Due Date")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {data.due_date}
                </span>
              </p>
            </>
          )}
          {isPresentation(data) && (
            <>
              <p>
                {t("Course")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {selectedCourse?.name || data.courseId}
                </span>
              </p>
              <p>
                {t("Topic")}:{" "}
                {data.topicId || selectedTopic ? (
                  <span className="px-2 py-0.5 bg-primary/20 rounded">
                    {selectedTopic?.title || data.topicId}
                  </span>
                ) : (
                  <span className="text-primary">
                    {t("topic is not selected")}
                  </span>
                )}
              </p>
              <p>
                {t("Title")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {data.title}
                </span>
              </p>
              <p>
                {t("File URL")}:{" "}
                <span className="px-2 py-0.5 bg-primary/20 rounded">
                  {data.file_url}
                </span>
              </p>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <CustomButton variants="outline" onClick={onClose}>
            Close
          </CustomButton>
          <CustomButton variants="primary" onClick={onConfirm}>
            Create
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
