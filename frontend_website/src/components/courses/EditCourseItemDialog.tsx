"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useTranslations } from "next-intl";
import {
  Assignment,
  defaultAssignmentType,
  defaultLectureType,
  defaultPresentationType,
  Lecture,
  Presentation,
} from "@/types/types";
import CustomButton from "../ui/customButton";
import { Save, X } from "lucide-react";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssignmentFormType,
  FormType,
  LectureFormType,
  PresentationFormType,
  formMap,
} from "@/schemas/courseItemsSchema";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import LectureForm from "./forms/LectureForm";
import AssignmentForm from "./forms/AssignmentForm";
import PresentationForm from "./forms/PresentationForm";

type ContentItem = Lecture | Assignment | Presentation;

const EditCourseItemDialog = ({
  open,
  setOpen,
  item,
  type,
  topicId,
  courseId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: ContentItem;
  type: string;
  topicId: string;
  courseId: string;
}) => {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();

  function isValidType(value: string | null): value is keyof typeof formMap {
    return (
      value === "lecture" || value === "assignment" || value === "presentation"
    );
  }

  const config = isValidType(type) ? formMap[type] : null;

  const schema = config?.schema;
  const defaults = config?.defaults;

  const form = useForm<FormType>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaults as
      | defaultLectureType
      | defaultAssignmentType
      | defaultPresentationType
      | undefined,
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
    setValue,
  } = form;

  const { mutate } = useApiMutation(
    type ? `/courses/create/${type}` : "/courses/create/invalid",
    "put"
  );

  useEffect(() => {
    if (courseId) {
      setValue("courseId", courseId);
    }
  }, [courseId, setValue]);

  useEffect(() => {
    if (topicId) {
      setValue("topicId", topicId);
    }
  }, [topicId, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if ((item as Lecture).content !== undefined) {
      const lectureItem = item as Lecture;
      setValue("title", lectureItem.title);
      setValue("content", lectureItem.content);
      setValue("image_url", lectureItem.image_url ?? undefined);
      setValue("video_url", lectureItem.video_url ?? undefined);
    } else if ((item as Assignment).due_date !== undefined) {
      const assignmentItem = item as Assignment;
      setValue("title", assignmentItem.title);
      setValue("description", assignmentItem.description);
      setValue("due_date", assignmentItem.due_date);
    } else if ((item as Presentation).file_url !== undefined) {
      const presentationItem = item as Presentation;
      setValue("title", presentationItem.title);
      setValue("file_url", presentationItem.file_url);
    }
  }, [item, type, open, setValue]);

  const onSubmit = (confirmedData: FormType) => {
    mutate(confirmedData, {
      onSuccess: () => {
        showToast("success", toastT(`${type} created successfully`));
        reset();
      },
      onError: () => {
        showToast("error", toastT("Failed to edit an item"));
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{t(`Edit ${type}`)}</DialogTitle>
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              {t("Title")}: {item.title}
            </p>
          </div>

          <div className="mt-6">
            {type === "lecture" && (
              <LectureForm
                register={register as UseFormRegister<LectureFormType>}
                errors={errors}
              />
            )}
            {type === "assignment" && (
              <AssignmentForm
                register={register as UseFormRegister<AssignmentFormType>}
                errors={errors}
              />
            )}
            {type === "presentation" && (
              <PresentationForm
                register={register as UseFormRegister<PresentationFormType>}
                errors={errors}
              />
            )}
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <CustomButton
              variants="outline"
              onClick={() => setOpen(false)}
              className="flex gap-2 items-center px-6 py-2"
            >
              <span>{t("Cancel")}</span>
              <span className="w-4 h-4">
                <X className="w-4 h-4" />
              </span>
            </CustomButton>

            <CustomButton
              variants="primary"
              className="px-6 py-2 flex gap-2 items-center"
              onClick={async () => {
                const valid = await trigger();
                if (valid) handleSubmit(onSubmit)();
              }}
              disabled={open}
            >
              <span>{t("Save")}</span>
              <span className="w-4 h-4">
                <Save className="w-4 h-4" />
              </span>
            </CustomButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditCourseItemDialog;
