import { User } from "@/types/types";
import { useTranslations } from "next-intl";

const ProfileInfo = ({ user }: { user: User }) => {
  const t = useTranslations("Profile");

  const dateString = new Date(user.created_at).toLocaleDateString();
  const timeString = new Date(user.created_at).toLocaleTimeString();
  const createdAt = `${dateString} ${timeString}`;

  return (
    <div className="p-4 border rounded-md bg-primary/5 dark:bg-primary/10">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-500">{t("Name")}</p>
          <p className="font-semibold">{user.name}</p>
        </div>

        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-500">{t("Phone Number")}</p>
          <p className="font-semibold">{user.phoneNumber}</p>
        </div>

        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-500">{t("Age")}</p>
          <p className="font-semibold">{user.age ?? "-"}</p>
        </div>

        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-500">{t("Email")}</p>
          <p className="font-semibold">{user.email}</p>
        </div>

        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-500">{t("Role")}</p>
          <p className="font-semibold">{t(`${user.role}`)}</p>
        </div>

        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-500">{t("Created At")}</p>
          <p className="font-semibold">{createdAt}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
