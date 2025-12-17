import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import CustomButton from "../ui/customButton";
import { useTranslations } from "next-intl";
import { Save, X } from "lucide-react";

interface profileEditFormType {
  name: string;
  age: string;
  phoneNumber: string;
}

const ProfileEditDialog = ({
  open,
  setOpen,
  form,
  setForm,
  handleSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: profileEditFormType;
  setForm: React.Dispatch<React.SetStateAction<profileEditFormType>>;
  handleSubmit: () => void;
}) => {
  const t = useTranslations("Profile");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:w-[60vw] sm:w-[80vw] max-w-[90vw] p-4 z-9999">
        <DialogHeader>
          <DialogTitle>{t("Edit Profile")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="text-sm mb-1">{t("Name")}</p>
            <Input
              className="rounded-sm border border-primary bg-primary/5! w-full min-h-10"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm mb-1">{t("Phone Number")}</p>
            <Input
              className="rounded-sm border border-primary bg-primary/5! w-full min-h-10"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />
          </div>

          <div>
            <p className="text-sm mb-1">{t("Age")}</p>
            <Input
              className="rounded-sm border border-primary bg-primary/5! w-full min-h-10"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end">
          <CustomButton
            className="px-6 py-2 flex items-center gap-2"
            variants="outline"
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
            <span>{t("Cancel")}</span>
          </CustomButton>

          <CustomButton
            className="px-6 py-2 flex items-center gap-2"
            variants="primary"
            onClick={handleSubmit}
          >
            <Save className="w-4 h-4" />
            <span>{t("Save")}</span>
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
