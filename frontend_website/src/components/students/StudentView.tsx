"use client";
import { Student } from "@/types/types";
import { useTranslations } from "next-intl";
import React from "react";

const StudentView = ({ student }: { student: Student | undefined }) => {
  const t = useTranslations("Students");

  if (!student) {
    return <div>{t("no student found")}</div>;
  }

  const createdAt = new Date(student.created_at);
  const createdAt_date = createdAt.toLocaleDateString();
  const createdAt_time = createdAt.toLocaleTimeString();
  const updatedAt = student.updated_at ? new Date(student.updated_at) : null;
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
          <p className="text-lg font-semibold">{student.name}</p>
        </div>

        <div className="flex gap-1 items-end">
          <p>{t("Email")}: </p>
          <p className="text-lg font-semibold">{student.email}</p>
        </div>
        <div className="flex gap-1 items-end">
          <p>{t("PhoneNumber")}: </p>
          <p className="text-lg font-semibold">{student.phoneNumber}</p>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex gap-1 items-end">
            <p>{t("studentId")}: </p>
            <p className="text-lg font-semibold">{student.studentId}</p>
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
              {student.age || t("unfilled")}
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

export default StudentView;
