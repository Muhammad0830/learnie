"use client";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Control } from "react-hook-form";
import { StudentFormData } from "@/schemas/studentSchema";
import { Course } from "@/types/types";

const FormCheckDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  control,
  selectedCourses,
  isSubmitting,
  action,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  control: Control<StudentFormData>;
  selectedCourses: Course[];
  isSubmitting: boolean;
  action?: "create" | "edit";
}) => {
  const t = useTranslations("Students");

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-none! lg:w-[70vw] md:w-[80vw] w-[90vw]">
        <DialogTitle>
          {action === "create"
            ? t("Creating a new Student")
            : t("Editing a new Student")}
        </DialogTitle>
        <div className="flex sm:flex-row flex-col items-start justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold">{t("Student")}</h3>
            <div>
              <span>{t("Name")}</span>
              {": "}
              <span className="font-semibold">{control._formValues.name}</span>
            </div>
            <div>
              <span>{t("Email")}</span>
              {": "}
              <span className="font-semibold">{control._formValues.email}</span>
            </div>
            <div>
              <span>{t("studentId")}</span>
              {": "}
              <span className="font-semibold">
                {control._formValues.studentId}
              </span>
            </div>
            <div>
              <span>{t("PhoneNumber")}</span>
              {": "}
              <span className="font-semibold">
                {control._formValues.phoneNumber}
              </span>
            </div>
            <div>
              <span>{t("Age")}</span>
              {": "}
              <span className="font-semibold">
                {control._formValues.age || t("unfilled")}
              </span>
            </div>
          </div>
          <div className="flex-1 sm:items-end flex flex-col">
            <h3 className="text-lg font-semibold">{t("Courses")}</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCourses?.length > 0 ? (
                selectedCourses?.map((course) => (
                  <div
                    key={course.id}
                    className="px-2 py-0.5 rounded-full bg-primary/20"
                  >
                    {course.name}
                  </div>
                ))
              ) : (
                <div>{t("no courses selected")}</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <DialogClose asChild>
            <button className="border border-primary rounded-sm px-5 py-2 cursor-pointer hover:bg-primary/10 transition-colors duration-150">
              {t("Cancel")}
            </button>
          </DialogClose>
          <button
            className="border border-primary rounded-sm px-5 py-2 cursor-pointer hover:bg-primary/10 transition-colors duration-150"
            type="submit"
            form="student_form"
          >
            {action === "create" && isSubmitting
              ? t("Creating")
              : action === "create" && !isSubmitting
              ? t("Create")
              : isSubmitting
              ? t("Editing")
              : t("Edit")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormCheckDialog;
