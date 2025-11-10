"use client";
import { UserRole } from "@/schemas/userLoginSchema";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { University } from "@/types/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import SelectUniversity from "@/components/auth/SelectUniversity";

interface FormProps {
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  universitySchema: string;
}

const LoginForm = ({
  onSubmit,
  errors,
  isSubmitting,
  register,
  universities,
  selectedRole,
  setValue,
}: {
  onSubmit: () => void;
  errors: FieldErrors<FormProps>;
  isSubmitting: boolean;
  register: UseFormRegister<FormProps>;
  universities: University[];
  selectedRole: string;
  setValue: UseFormSetValue<FormProps>;
}) => {
  const t = useTranslations("AuthPage");
  const ROLES = UserRole.options;

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

      <div>
        <label className="block mb-0.5 font-semibold">Select Role</label>
        <div className="grid grid-cols-3 gap-4">
          {ROLES.map((role) => (
            <label
              key={role}
              htmlFor={role}
              className={cn(
                "cursor-pointer hover:border-primary border border-foreground/60 rounded p-1 h-10 flex items-center justify-center transition-colors duration-150",
                selectedRole === role && "bg-primary/5 border-primary"
              )}
            >
              <input
                type="radio"
                id={role}
                value={role}
                {...register("role")}
                className="hidden"
              />
              <div className="capitalize">{role}</div>
            </label>
          ))}
        </div>
        {errors.role && (
          <p className="text-red-500 sm:text-sm mt-1 text-xs">
            {t(`${errors.role.message}`)}
          </p>
        )}
      </div>

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
