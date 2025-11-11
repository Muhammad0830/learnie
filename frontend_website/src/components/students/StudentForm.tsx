"use client";
import { cn } from "@/lib/utils";
import { StudentFormData } from "@/schemas/studentSchema";
import { useTranslations } from "next-intl";
import React from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { PhoneInput } from "./PhoneInput";

type StudentFormProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  errors: FieldErrors<StudentFormData>;
  register: UseFormRegister<StudentFormData>;
  control: Control<StudentFormData>;
  setValue: UseFormSetValue<StudentFormData>;
  onPhoneValidityChange?: (isValid: boolean) => void;
  editPage?: boolean;
  passwordError?: string;
};

const StudentForm = ({
  onSubmit,
  errors,
  register,
  control,
  setValue,
  onPhoneValidityChange,
  editPage,
  passwordError,
}: StudentFormProps) => {
  const t = useTranslations("Students");

  return (
    <form id="student_form" onSubmit={onSubmit} className="space-y-4">
      <div className="flex sm:gap-2 gap-4 sm:flex-row flex-col">
        {/* name */}
        <div className="relative flex-1">
          <label className="block mb-0.5 font-semibold">{t("Name")}</label>
          <input
            type="text"
            {...register("name")}
            className={cn(
              "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
              errors.name && "border-red-600"
            )}
            placeholder={t("EnterStudentName") as string}
          />
          {errors.name && (
            <p className="text-red-500 sm:text-sm absolute text-xs">
              {t(`${errors.name.message}`)}
            </p>
          )}
        </div>

        {/* email */}
        <div className="relative flex-1">
          <label className="block mb-0.5 font-semibold">{t("Email")}</label>
          <input
            type="email"
            {...register("email")}
            className={cn(
              "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
              errors.name && "border-red-600"
            )}
            placeholder={t("EnterStudentEmail") as string}
          />
          {errors.email && (
            <p className="text-red-500 sm:text-sm absolute text-xs">
              {t(`${errors.email.message}`)}
            </p>
          )}
        </div>
      </div>

      <div className="flex sm:gap-2 gap-4 sm:flex-row flex-col">
        {/* phone number */}
        <div className="relative flex-1">
          <label className="block mb-0.5 font-semibold">
            {t("PhoneNumber")}
          </label>
          <PhoneInput
            className="rounded"
            value={control._formValues.phoneNumber}
            onChange={(value) => {
              if (value) {
                setValue("phoneNumber", value);
              }
            }}
            onValidityChange={onPhoneValidityChange}
            placeholder={t("EnterStudentPhoneNumber") as string}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 sm:text-sm absolute text-xs">
              {t(`${errors.phoneNumber.message}`)}
            </p>
          )}
        </div>

        {/* studentId */}
        <div className="relative flex-1">
          <label className="block mb-0.5 font-semibold">{t("studentId")}</label>
          <input
            type="text"
            {...register("studentId", {
              required: t("studentId is required") as string,
              pattern: {
                value: /^[0-9]+$/,
                message: t("StudentIdMustBeNumber") as string,
              },
              onChange: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              },
            })}
            className={cn(
              "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
              errors.studentId && "border-red-600"
            )}
            placeholder={t("EnterStudentStudentId") as string}
          />
          {errors.studentId && (
            <p className="text-red-500 sm:text-sm absolute text-xs">
              {t(`${errors.studentId.message}`)}
            </p>
          )}
        </div>
      </div>

      <div className="flex sm:flex-row flex-col sm:gap-2 gap-4">
        {/* age */}
        <div className="relative flex-1">
          <label className="block mb-0.5 font-semibold">
            <span>{t("Age")} </span>
            <span className="text-xs font-normal">({t("optional")})</span>
          </label>
          <input
            type="text"
            {...register("age", {
              required: t("AgeIsRequired") as string,
              pattern: {
                value: /^[0-9]+$/,
                message: t("AgeMustBeNumber") as string,
              },
              onChange: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              },
            })}
            className={cn(
              "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
              errors.age && "border-red-600"
            )}
            placeholder={t("EnterStudentAge") as string}
          />
          {errors.age && (
            <p className="text-red-500 sm:text-sm absolute text-xs">
              {t(`${errors.age.message}`)}
            </p>
          )}
        </div>

        {/* password */}
        {!editPage ? (
          <div className="relative flex-1">
            <label className="block mb-0.5 font-semibold">
              {t("password")}
            </label>
            <input
              type="text"
              {...register("password")}
              className={cn(
                "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
                passwordError && "border-red-600"
              )}
              placeholder={t("EnterStudentPassword") as string}
            />
            {passwordError && (
              <p className="text-red-500 sm:text-sm absolute text-xs">
                {t(`${passwordError}`)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex-1 max-sm:hidden"></div>
        )}
      </div>
    </form>
  );
};

export default StudentForm;
