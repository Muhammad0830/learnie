"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useApiMutation } from "@/hooks/useApiMutation";

import CustomButton from "@/components/ui/customButton";

import { useAuth } from "@/context/AuthContext";
import ProfileEditDialog from "@/components/profile/ProfileEditDialog";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { useCustomToast } from "@/context/CustomToastContext";

interface profileEditFormType {
  name: string;
  age: string;
  phoneNumber: string;
}

const AdminProfilePage = () => {
  const t = useTranslations("Admin");

  const { user, refetchProfile } = useAuth();
  const updateMutation = useApiMutation(`/users/${user?.id}`, "put");
  const { showToast } = useCustomToast();
  const toastT = useTranslations("Toast");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<profileEditFormType>({
    name: "",
    age: "",
    phoneNumber: "",
  });

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
