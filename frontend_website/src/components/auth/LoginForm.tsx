"use client";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { University } from "@/types/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import SelectUniversity from "@/components/auth/SelectUniversity";

interface FormProps {
  email: string;
  password: string;
  universitySchema: string;
}

const LoginForm = ({
  onSubmit,
  errors,
  isSubmitting,
  register,
  universities,
  setValue,
}: {
  onSubmit: () => void;
  errors: FieldErrors<FormProps>;
  isSubmitting: boolean;
  register: UseFormRegister<FormProps>;
  universities: University[];
  setValue: UseFormSetValue<FormProps>;
}) => {
  const t = useTranslations("AuthPage");

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 w-full"
      id="login-form"
    >
      <div className="relative">
        <label className="block mb-0.5 font-semibold">{t("Email")}</label>
        <input
          type="email"
          {...register("email")}
          className={cn(
            "border border-foreground/60 rounded p-2 w-full h-10",
            errors.email && "border-red-600"
          )}
          placeholder={t("EnterYourEmail") as string}
        />
        {errors.email && (
          <p className="text-red-500 sm:text-sm absolute text-xs">
            {t(`${errors.email.message}`)}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block mb-0.5 font-semibold">{t("Password")}</label>
        <input
          type="text"
          {...register("password")}
          className={cn(
            "border border-foreground/60 rounded p-2 w-full h-10",
            errors.password && "border-red-600"
          )}
          placeholder={t("EnterYourpPassword") as string}
        />
        {errors.password && (
          <p className="text-red-500 sm:text-sm absolute text-xs">
            {t(`${errors.password.message}`)}
          </p>
        )}
      </div>

      <SelectUniversity
        setValue={setValue}
        errors={errors}
        universities={universities}
      />

      <button
        type="submit"
        form="login-form"
        disabled={isSubmitting}
        className="bg-primary/70 text-white rounded p-2 hover:bg-primary cursor-pointer"
      >
        {isSubmitting ? t("Submitting") : t("Submit")}
      </button>
    </form>
  );
};

export default LoginForm;
