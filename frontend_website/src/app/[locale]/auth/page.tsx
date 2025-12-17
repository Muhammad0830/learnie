"use client";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema, UserFormData } from "@/schemas/userLoginSchema";
import { useApiMutation } from "@/hooks/useApiMutation";
import { LoginFormData, LoginResponse, University } from "@/types/types";
import useApiQuery from "@/hooks/useApiQuery";
import { setUniversitySchema } from "@/lib/api";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/header_sidebar/ThemeToggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LangDropDown from "@/components/header_sidebar/LangDropDown";
import { useCustomToast } from "@/context/CustomToastContext";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = useTranslations("AuthPage");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      role: "student",
      universitySchema: "",
    },
  });
  const { theme: currentTheme, setTheme } = useTheme();
  const { showToast } = useCustomToast();
  const toastT = useTranslations("Toast");

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const { data: universities, isLoading: universitiesLoading } = useApiQuery<
    University[]
  >("/university", { key: "UniversityList" });

  const { mutate } = useApiMutation<LoginResponse, LoginFormData>(
    "/auth/login",
    "post",
    (variables) => ({
      "x-university-schema": variables.universitySchema,
    })
  );

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: () => {
        showToast("success", toastT("Login successful"));
        reset();
        setUniversitySchema(data.universitySchema);
        window.location.href = "/dashboard";
      },
      onError: (error) => {
        showToast("error", toastT("Login failed"));
        console.error("Login failed", error);
      },
    });
  };

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  if (universitiesLoading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 flex justify-center items-center">
      <div className="rounded-lg p-4 border border-foreground/20 relative flex flex-col space-y-2 sm:min-w-[400px] sm:max-w-[500px] max-w-[400px] sm:w-[40vw] w-[90vw]">
        <div className="flex justify-between items-center">
          <ThemeToggle currentTheme={currentTheme} toggleTheme={toggleTheme} />
          <h1 className="lg:text-3xl text-2xl font-semibold mx-auto inline-block mb-4">
            {t("Sign in")}
          </h1>
          <LangDropDown
            currentTheme={currentTheme}
            langDropdownOpen={langDropdownOpen}
            setLangDropdownOpen={setLangDropdownOpen}
            backgroundColor="background"
          />
        </div>

        <LoginForm
          onSubmit={handleSubmit(onSubmit)}
          errors={errors}
          isSubmitting={isSubmitting}
          register={register}
          setValue={setValue}
          universities={universities || []}
          selectedRole={selectedRole}
        />
      </div>
    </div>
  );
};

export default Page;
