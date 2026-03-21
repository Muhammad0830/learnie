"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User, Role } from "@/types/types";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";

export const columns = (
  handleRemove: (userId: string) => void,
  t: ReturnType<typeof useTranslations>,
  role: Role,
): ColumnDef<User>[] => {
  const nameObject = {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: { row: { original: User } }) => {
      return (
        <div className="h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate">
          {row.original.name}
        </div>
      );
    },
  };
  const emailObject = {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: { original: User } }) => {
      return (
        <div className="h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate">
          {row.original.email}
        </div>
      );
    },
  };
  const studentIdObject = {
    accessorKey: "studentId",
    header: "Student Id",
    cell: ({ row }: { row: { original: User } }) => {
      return (
        <div className="h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate">
          {row.original.studentId}
        </div>
      );
    },
  };
  const actionsObject = {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: User } }) => {
      const user = row.original;
      return (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => handleRemove(user.id)}
            className="px-2 py-1 cursor-pointer rounded border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center gap-2"
          >
            <Trash className="w-4 h-4" />
            <span className="text-base/5.5">{t("Remove")}</span>
          </button>
        </div>
      );
    },
  };
  if (role === "student")
    return [nameObject, emailObject, studentIdObject, actionsObject];
  else return [nameObject, emailObject, actionsObject];
};
