"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";

import CourseAndTopicSelector from "@/components/courses/CourseAndTopicSelector";
import ConfirmDialog from "@/components/courses/ConfirmDialog";

import LectureForm from "@/components/courses/forms/LectureForm";
import AssignmentForm from "@/components/courses/forms/AssignmentForm";
import PresentationForm from "@/components/courses/forms/PresentationForm";

import {
  LectureSchema,
  AssignmentSchema,
  PresentationSchema,
  FormType,
} from "@/schemas/courseItemsSchema";

import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface defaultLectureType {
  title: string;
  content: string;
  image_url: string;
  video_url: string;
}
interface defaultAssignmentType {
  title: string;
  description: string;
  due_date: string;
  images: string[];
}
interface defaultPresentationType {
  title: string;
  file_url: string;
}

export default function CreateItemPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("pageType"); // lecture | assignment | presentation

  const router = useRouter();
  const t = useTranslations("Courses");
  const { showToast } = useCustomToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<
    defaultLectureType | defaultAssignmentType | defaultPresentationType | null
  >(null);

  const formMap = {
    lecture: {
      schema: LectureSchema,
      defaults: { title: "", content: "", image_url: "", video_url: "" },
    },
    assignment: {
      schema: AssignmentSchema,
      defaults: { title: "", description: "", due_date: "", images: [] },
    },
    presentation: {
      schema: PresentationSchema,
      defaults: { title: "", file_url: "" },
    },
  } as const;

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
    control,
  } = form;

  const selectedCourseId = useWatch({ control, name: "courseId" });
  const selectedCourse = selectedCourseId;
  const selectedTopicId = useWatch({ control, name: "topicId" });
  const formValues = useWatch({ control });
  console.log("formValues", formValues);

  const { mutate } = useApiMutation(
    type ? `/courses/create/${type}` : "/courses/create/invalid",
    "post"
  );

  const onSubmit = async (
    data: defaultLectureType | defaultAssignmentType | defaultPresentationType
  ) => {
    setDialogData(data);
    setDialogOpen(true);
  };

  const sendToServer = (
    confirmedData:
      | defaultLectureType
      | defaultAssignmentType
      | defaultPresentationType
  ) => {
    console.log("submitted data", confirmedData);
    mutate(confirmedData, {
      onSuccess: () => {
        showToast("success", t(`${type} created successfully`));
        reset();
        router.push("/courses");
      },
      onError: () => {
        showToast("error", "Failed to create item");
      },
    });
  };

  return (
    <div className="h-full">
      {!config ? (
        <div className="w-full h-full flex justify-center items-center">
          {t("Invalid Page Url")}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">
            {type
              ? t(`Create ${type.charAt(0).toUpperCase() + type.slice(1)}`)
              : "Craete Item"}
          </h1>

          <CourseAndTopicSelector
            register={register}
            errors={errors}
            selectedCourseId={selectedCourseId}
          />

          <div className="mt-6">
            {type === "lecture" && (
              <LectureForm register={register} errors={errors} />
            )}
            {type === "assignment" && (
              <AssignmentForm register={register} errors={errors} />
            )}
            {type === "presentation" && (
              <PresentationForm register={register} errors={errors} />
            )}
          </div>

          <button
            type="submit"
            className="mt-6 px-3 py-1.5 border rounded bg-primary/20 hover:bg-primary/30"
            onClick={async () => {
              const valid = await trigger();
              console.log("errors", errors);
              console.log("valid", valid);
              if (valid) handleSubmit(onSubmit)();
            }}
          >
            {t("Submit")}
          </button>

          <ConfirmDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={() => dialogData && sendToServer(dialogData)}
            data={dialogData}
          />
        </>
      )}
    </div>
  );
}
