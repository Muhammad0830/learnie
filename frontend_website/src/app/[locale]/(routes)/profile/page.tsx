"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useApiMutation } from "@/hooks/useApiMutation";

import CustomButton from "@/components/ui/customButton";

import { useAuth } from "@/context/AuthContext";
import ProfileEditDialog from "@/components/profile/ProfileEditDialog";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { useCustomToast } from "@/context/CustomToastContext";
import { usePathname, useRouter } from "next/navigation";

interface profileEditFormType {
  name: string;
  age: string;
  phoneNumber: string;
}

const AdminProfilePage = () => {
  const t = useTranslations("Profile");
  const toastT = useTranslations("Toast");

  const {
    user,
    refetchProfile,
    logout,
    success,
    error,
    loading,
    setSuccess,
    setError,
  } = useAuth();
  const router = useRouter();
  const { showToast, showLoadingToast, hideLoadingToast } = useCustomToast();
  const updateMutation = useApiMutation(`/users/${user?.id}`, "put");
  const pathName = usePathname();
  const locale = pathName.split("/")[1];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<profileEditFormType>({
    name: "",
    age: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (success === "logout") {
      showToast("success", toastT("Logout successfully"));
      setSuccess(null);
      router.push(`/${locale}/auth`);
    } else if (error === "logout") {
      showToast("error", toastT("Logout failed"));
      setError(null);
    }

    if (loading) {
      showLoadingToast(`${t("Loading")}`);
    } else {
      hideLoadingToast();
    }
  }, [success, error, loading]); // eslint-disable-line

  const handleOpenEdit = () => {
    if (!user) return;
    setForm({
      name: user.name,
      age: user?.age || "",
      phoneNumber: user?.phoneNumber,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    await updateMutation.mutateAsync(form, {
      onSuccess: () => {
        showToast("success", toastT("Profile updated successfully"));
        refetchProfile();
        setOpen(false);
      },
    });
    setOpen(false);
  };

  if (!user) {
    return <div className="my-10 text-center">{t("Loading")}...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Admin Profile")}
        </h1>

        <CustomButton
          variants="primary"
          onClick={handleOpenEdit}
          className="px-4 py-2"
        >
          {t("Edit Profile")}
        </CustomButton>
      </div>

      {/* PROFILE DETAILS */}
      <ProfileInfo user={user} />

      {/* LOGOUT */}
      <CustomButton
        variants="destructive"
        className="bg-red-600/30 dark:bg-red-600/20 dark:border-red-600/60 border-red-600/60"
        onClick={() => handleLogout()}
      >
        {t("Logout")}
      </CustomButton>

      {/* EDIT DIALOG */}
      <ProfileEditDialog
        handleSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default AdminProfilePage;
