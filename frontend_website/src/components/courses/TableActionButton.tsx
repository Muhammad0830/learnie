"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Course } from "@/types/types";
import { useTranslations } from "next-intl";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import Link from "next/link";

const TableActionButton = ({
  payment,
  refetch,
}: {
  payment: Course;
  refetch: () => void;
}) => {
  const t = useTranslations("Courses");
  const toastT = useTranslations("Toast");

  const { showToast } = useCustomToast();

  const handleDelete = async (id: string) => {
    deleteStudent(id, {
      onSuccess: () => {
        showToast("success", toastT("Course deleted successfully"));
        refetch();
      },
    });
  };

  const { mutate: deleteStudent } = useApiMutation(
    (id) => `/courses/delete/${id}`,
    "delete"
  );

  return (
    <DropdownMenu modal={false}>
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
            href={`/courses/view/${payment.id}`}
            className="flex items-center gap-2 hover:bg-primary/30 cursor-pointer w-full h-full px-2 py-1.5 rounded-sm"
          >
            <Eye />
            <span>{t("View")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0 hover:bg-transparent!">
          <Link
            href={`/courses/edit/${payment.id}`}
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
