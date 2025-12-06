"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm, UseFormRegister, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  LectureFormType,
  AssignmentFormType,
  PresentationFormType,
} from "@/schemas/courseItemsSchema";

import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Course, Topic } from "@/types/types";
import Link from "next/link";

interface defaultLectureType {
  courseId: string;
  topicId: string;
  title: string;
  content: string;
  image_url: string;
  video_url: string;
}
interface defaultAssignmentType {
  courseId: string;
  topicId: string;
  title: string;
  description: string;
  due_date: string;
  images: string[];
}
interface defaultPresentationType {
  courseId: string;
  topicId: string;
  title: string;
  file_url: string;
}

export default function CreateItemPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("pageType"); // lecture | assignment | presentation
  const courseId = searchParams.get("courseId");
  const topicId = searchParams.get("topicId");

  const router = useRouter();
  const t = useTranslations("Courses");
  const { showToast } = useCustomToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<FormType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const formMap = {
    lecture: {
      schema: LectureSchema,
      defaults: {
        title: "",
        content: "",
        image_url: "",
        video_url: "",
        courseId: "",
        topicId: "",
      },
    },
    assignment: {
      schema: AssignmentSchema,
      defaults: {
        title: "",
        description: "",
        due_date: "",
        images: [],
        courseId: "",
        topicId: "",
      },
    },
    presentation: {
      schema: PresentationSchema,
      defaults: {
        title: "",
        file_url: "",
        courseId: "",
        topicId: "",
      },
    },
  } as {
    lecture: {
      schema: typeof LectureSchema;
      defaults: {
        title: string;
        content: string;
        image_url: string;
        video_url: string;
      };
    };
    assignment: {
      schema: typeof AssignmentSchema;
      defaults: {
        title: string;
        description: string;
        due_date: string;
        images: string[];
      };
    };
    presentation: {
      schema: typeof PresentationSchema;
      defaults: { title: string; file_url: string };
    };
  };

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
    control,
  } = form;

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

  const selectedCourseId = useWatch({ control, name: "courseId" });
  const selectedTopicId = useWatch({ control, name: "topicId" });

  const { mutate } = useApiMutation(
    type ? `/courses/create/${type}` : "/courses/create/invalid",
    "post"
  );

  const onSubmit = async (data: FormType) => {
    setDialogData(data);
    setDialogOpen(true);
  };

  const sendToServer = (confirmedData: FormType) => {
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
          <div className="flex items-center gap-2 justify-between mb-2">
            <h1 className="text-3xl font-bold mb-4">
              {type
                ? t(`Create ${type.charAt(0).toUpperCase() + type.slice(1)}`)
                : "Craete Item"}
            </h1>

            <Link
              href={courseId ? `/courses/view/${courseId}` : "/courses"}
              className="px-3 py-1.5 max-sm:text-sm rounded border border-primary bg-primary/10 hover:bg-primary/20"
            >
              {courseId ? t("Back to the course") : t("Back to courses")}
            </Link>
          </div>

          <CourseAndTopicSelector
            errors={errors}
            selectedCourseId={Number(selectedCourseId)}
            setValue={setValue}
            selectedTopicId={selectedTopicId}
            setSelectedCourse={setSelectedCourse}
            setSelectedTopic={setSelectedTopic}
          />

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

          <button
            type="submit"
            className="mt-6 mb-3 px-3 py-1.5 border rounded bg-primary/20 hover:bg-primary/30"
            onClick={async () => {
              const valid = await trigger();
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
            selectedCourse={selectedCourse}
            selectedTopic={selectedTopic}
          />
        </>
      )}
    </div>
  );
}
