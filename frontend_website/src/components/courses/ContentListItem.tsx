"use client";
import { Assignment, Lecture, Presentation } from "@/types/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import CustomButton from "../ui/customButton";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import EditCourseItemDialog from "./EditCourseItemDialog";

type ContentItem = Lecture | Assignment | Presentation;

const ContentListItem = ({
  item,
  type,
  courseId,
  topicId,
  refetch,
}: {
  item: ContentItem;
  type: "lecture" | "assignment" | "presentation";
  courseId: string;
  topicId: string;
  refetch: () => void;
}) => {
  const t = useTranslations("Courses");
  const [open, setOpen] = useState(false);
  const isPresentation = type === "presentation";
  const viewHref = isPresentation
    ? (item as Presentation).file_url
    : `/courses/${courseId}/topics/${topicId}/${type}s?selected=${item.id}`;

  const target = isPresentation ? "_blank" : undefined;
  const rel = isPresentation ? "noopener noreferrer" : undefined;

  return (
    <div className="p-3 rounded-sm border border-primary/20 flex justify-between gap-2 items-center bg-background-secondary/50">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold truncate">{item.title}</span>
        {"due_date" in item && (
          <p className="text-xs text-muted-foreground">
            {t("Due Date")}: {new Date(item.due_date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex gap-2 shrink-0 sm:flex-row ">
        <Link href={viewHref} target={target} rel={rel}>
          <CustomButton
            variants="outline"
            className="max-sm:px-2 max-sm:py-2 flex gap-2 items-center"
          >
            <span className="hidden sm:block">{t("View")}</span>
            <Eye className="w-4 h-4" />
          </CustomButton>
        </Link>

        <CustomButton
          onClick={() => setOpen(true)}
          variants="outline"
          className="max-sm:px-2 max-sm:py-2 flex gap-2 items-center"
        >
          <span className="hidden sm:block">{t("Edit")}</span>
          <Pencil className="w-4 h-4" />
        </CustomButton>
      </div>

      <EditCourseItemDialog
        open={open}
        setOpen={setOpen}
        item={item}
        type={type}
        topicId={topicId}
        courseId={courseId}
        refetch={refetch}
      />
    </div>
  );
};

export default ContentListItem;
