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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import CustomButton from "../ui/customButton";

const TableActionButton = ({
  payment,
  refetch,
}: {
  payment: Student;
  refetch: () => void;
}) => {
  const t = useTranslations("Students");
  const toastT = useTranslations("Toast");
  const [open, setOpen] = useState(false);

  const { showToast } = useCustomToast();

  const handleDelete = async (id: string) => {
    deleteStudent(id, {
      onSuccess: () => {
        showToast("success", toastT("Student deleted successfully"));
        refetch();
      },
    });
  };

  const { mutate: deleteStudent } = useApiMutation(
    (id) => `/users/${id}`,
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
            href={`/students/view/${payment.id}`}
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
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 hover:bg-primary/30 cursor-pointer w-full h-full px-2 py-1.5 rounded-sm"
          >
            <Trash2 />
            <span>{t("Delete")}</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4 max-w-[600px]! lg:w-[50vw] sm:w-[70vw] sm:min-w-[400px] w-[90vw] min-w-[300px]">
          <DialogTitle className="text-xl sm:text-2xl">
            {t("Are you sure to delete this student?")}
          </DialogTitle>

          <DialogDescription className="flex flex-col gap-1">
            <span>
              {t("Name")}: {payment.name}
            </span>
            <span>
              {t("studentId")}: {payment.studentId}
            </span>
          </DialogDescription>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <CustomButton className="px-6 py-2" variants="outline">
                {t("Close")}
              </CustomButton>
            </DialogClose>
            <CustomButton
              onClick={() => handleDelete(payment.id)}
              className="px-6 py-2"
              variants="primary"
            >
              {t("Delete")}
            </CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};

export default TableActionButton;
