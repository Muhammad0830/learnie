"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User, Role } from "@/types/types";
import { Plus, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface UserProps extends User {
  isPendingAdd?: boolean;
  isPendingRemove?: boolean;
}

export const columns = (
  handleAdd: (user: UserProps) => void,
  handleUndoAdd: (user: UserProps) => void,
  t: ReturnType<typeof useTranslations>,
  role: Role,
  // eslint-disable-next-line
): ColumnDef<UserProps, any>[] => {
  const nameObject = {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: { row: { original: UserProps | null } }) => {
      return (
        <div
          className={cn(
            "h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate",
          )}
        >
          {row.original?.name}
        </div>
      );
    },
  };
  const emailObject = {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: { original: UserProps | null } }) => {
      return (
        <div className="h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate">
          {row.original?.email}
        </div>
      );
    },
  };
  const studentIdObject = {
    accessorKey: "studentId",
    header: "Student Id",
    cell: ({ row }: { row: { original: UserProps | null } }) => {
      return (
        <div className="h-full lg:max-w-[350px] md:max-w-[250px] max-w-[200px] overflow-hidden relative truncate">
          {row.original?.studentId}
        </div>
      );
    },
  };
  const actionsObject = {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: UserProps | null } }) => {
      const user = row.original;
      if (!user?.id) return null;
      const alreadyAdded = user.isPendingAdd;
      return (
        <div className="h-8 flex justify-center gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              if (alreadyAdded) handleUndoAdd(user);
              else handleAdd(user);
            }}
            className="px-2 py-1 cursor-pointer rounded border border-primary/40 bg-primary/10 hover:bg-primary/20 flex items-center justify-center gap-2"
          >
            {alreadyAdded ? (
              <Undo2 className="w-4.5 h-4.5" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="text-base/5.5 max-sm:hidden">
              {alreadyAdded ? t("Undo") : t("Add")}
            </span>
          </button>
        </div>
      );
    },
  };
  if (role === "student")
    return [nameObject, emailObject, studentIdObject, actionsObject];
  else return [nameObject, emailObject, actionsObject];
};
