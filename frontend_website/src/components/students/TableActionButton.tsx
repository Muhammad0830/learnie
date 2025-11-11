"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Student } from "@/types/types";
import { useTranslations } from "next-intl";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import Link from "next/link";

const TableActionButton = ({
  payment,
  refetch,
}: {
  payment: Student;
  refetch: () => void;
}) => {
  const t = useTranslations("Students");

  const { showToast } = useCustomToast();

  const handleDelete = async (id: string) => {
    deleteStudent(id, {
      onSuccess: () => {
        showToast("success", t("Student deleted successfully"));
        refetch();
      },
    });
  };

  const { mutate: deleteStudent } = useApiMutation(
    (id) => `/students/delete/${id}`,
    "delete"
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-8 w-8 p-0 border border-primary rounded-sm flex justify-center items-center bg-primary/10 cursor-pointer hover:bg-primary/20 transition-colors duration-150"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-black relative border border-primary"
      >
        <div className="absolute inset-0 bg-primary/10"></div>
        <DropdownMenuItem className="p-0 hover:bg-transparent!">
          <Link
            href={`/students/${payment.id}`}
            className="flex items-center gap-2 hover:bg-primary/30 cursor-pointer w-full h-full px-2 py-1.5 rounded-sm"
          >
            <Eye />
            <span>{t("View")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 hover:bg-transparent!">
          <Link
            href={`/students/edit/${payment.id}`}
            className="flex items-center gap-2 hover:bg-primary/30 cursor-pointer w-full h-full px-2 py-1.5 rounded-sm"
          >
            <Pencil />
            <span>{t("Edit")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 hover:bg-transparent!">
          <button
            onClick={() => handleDelete(payment.id)}
            className="flex items-center gap-2 hover:bg-primary/30 cursor-pointer w-full h-full px-2 py-1.5 rounded-sm"
          >
            <Trash2 />
            <span>{t("Delete")}</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActionButton;
