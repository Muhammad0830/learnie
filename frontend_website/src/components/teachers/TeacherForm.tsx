"use client";
import { cn } from "@/lib/utils";
import { TeacherFormData } from "@/schemas/teacherSchema";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { PhoneInput } from "../ui/PhoneInput";

type TeacherFormProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  errors: FieldErrors<TeacherFormData>;
  register: UseFormRegister<TeacherFormData>;
  control: Control<TeacherFormData>;
  setValue: UseFormSetValue<TeacherFormData>;
  onPhoneValidityChange?: (isValid: boolean) => void;
  editPage?: boolean;
  passwordError?: string;
  emailError?: string;
};

const TeacherForm = ({
  onSubmit,
  errors,
  register,
  control,
  setValue,
  onPhoneValidityChange,
  editPage,
  passwordError,
  emailError,
}: TeacherFormProps) => {
  const t = useTranslations("Teachers");
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  return (
    <form id="teacher_form" onSubmit={onSubmit} className="space-y-4">
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
            placeholder={t("EnterTeacherName") as string}
          />
          {errors.name && (
            <p className="text-red-500 sm:text-sm absolute text-xs">
              {t(`${errors.name.message}`)}
            </p>
          )}
        </div>

        {/* age or email */}
        {editPage ? (
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
              placeholder={t("EnterTeacherAge") as string}
            />
            {errors.age && (
              <p className="text-red-500 sm:text-sm absolute text-xs">
                {t(`${errors.age.message}`)}
              </p>
            )}
          </div>
        ) : (
          <div className="relative flex-1">
            <label className="block mb-0.5 font-semibold">{t("Email")}</label>
            <input
              type="email"
              {...register("email")}
              className={cn(
                "border border-foreground/60 rounded p-2 w-full h-10 bg-background-secondary",
                (errors.email || emailError) && "border-red-600"
              )}
              placeholder={t("EnterTeacherEmail") as string}
            />
            {(errors.email || emailError) && (
              <p className="text-red-500 sm:text-sm absolute text-xs">
                {t(`${errors?.email?.message || emailError}`)}
              </p>
            )}
          </div>
        )}
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
                setIsPhoneValid(true);
              } else setIsPhoneValid(false);
            }}
            onValidityChange={onPhoneValidityChange}
            placeholder={t("EnterTeacherPhoneNumber") as string}
          />
          {(errors.phoneNumber || !isPhoneValid) && (
            <p className="text-red-500 sm:text-sm absolute text-xs">
              {t(`${errors?.phoneNumber?.message || "Invalid phone number"}`)}
            </p>
          )}
        </div>

        {/* age */}
        {editPage ? (
          <div className="flex-1"></div>
        ) : (
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
              placeholder={t("EnterTeacherAge") as string}
            />
            {errors.age && (
              <p className="text-red-500 sm:text-sm absolute text-xs">
                {t(`${errors.age.message}`)}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex sm:flex-row flex-col sm:gap-2 gap-4">
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
              placeholder={t("EnterTeacherPassword") as string}
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
        <div className="flex-1 sm:flex hidden"></div>
      </div>
    </form>
  );
};

export default TeacherForm;
