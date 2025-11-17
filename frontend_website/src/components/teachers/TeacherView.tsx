"use client";
import { Teacher } from "@/types/types";
import { useTranslations } from "next-intl";

const TeacherView = ({ teacher }: { teacher: Teacher | undefined }) => {
  const t = useTranslations("Teachers");

  if (!teacher) {
    return <div>{t("no teacher found")}</div>;
  }

  const createdAt = new Date(teacher.created_at);
  const createdAt_date = createdAt.toLocaleDateString();
  const createdAt_time = createdAt.toLocaleTimeString();
  const updatedAt = teacher.updated_at ? new Date(teacher.updated_at) : null;
  const updatedAt_date = updatedAt?.toLocaleDateString();
  const updatedAt_time = updatedAt?.toLocaleTimeString();

  const newCreatedAt = `${createdAt_date} ${createdAt_time}`;
  const newUpdatedAt =
    updatedAt_date && updatedAt_time
      ? `${updatedAt_date} ${updatedAt_time}`
      : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex gap-1 items-end">
          <p>{t("Name")}: </p>
          <p className="text-lg font-semibold">{teacher.name}</p>
        </div>

        <div className="flex gap-1 items-end">
          <p>{t("Email")}: </p>
          <p className="text-lg font-semibold">{teacher.email}</p>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex gap-1 items-end">
            <p>{t("PhoneNumber")}: </p>
            <p className="text-lg font-semibold">{teacher.phoneNumber}</p>
          </div>
          <div className="sm:flex hidden gap-1 items-end">
            <p className="text-lg font-semibold">{newCreatedAt}</p>
            <p> :{t("created_at")}</p>
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex gap-1 items-end">
            <p>{t("Age")}: </p>
            <p className="text-lg font-semibold">
              {teacher.age || t("unfilled")}
            </p>
          </div>
          <div className="sm:flex hidden gap-1 items-end">
            <p className="text-lg font-semibold">
              {newUpdatedAt ?? t("not updated yet")}
            </p>
            <p> :{t("updated_at")}</p>
          </div>
        </div>

        <div className="max-sm:flex hidden gap-1 items-end">
          <p>{t("created_at")}: </p>
          <p className="text-lg font-semibold">{newCreatedAt}</p>
        </div>
        <div className="max-sm:flex hidden gap-1 items-end">
          <p>{t("updated_at")}: </p>
          <p className="text-lg font-semibold">
            {newUpdatedAt ?? t("not updated yet")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
