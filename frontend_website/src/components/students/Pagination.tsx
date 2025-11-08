"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React from "react";

const Pagination = ({
  totalStudents,
  totalPages,
  setPage,
  page,
}: {
  totalStudents: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}) => {
  const t = useTranslations("Students");
  if (!totalPages) {
    return null;
  }

  return (
    <div className="flex gap-2 items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold">
          {t("totalStudents")}: {totalStudents}
        </span>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={cn(
            "border border-primary bg-primary/40 dark:bg-primary/20 hover:bg-primary/60 dark:hover:bg-primary/10 cursor-pointer px-2 py-0.5 rounded-sm ",
            page === 1
              ? "opacity-50 cursor-default hover:bg-primary/40 dark:hover:bg-primary/20"
              : ""
          )}
        >
          {t("Previous")}
        </button>
        <button
          onClick={() => setPage(1)}
          className={cn(
            "border border-primary bg-primary/40 dark:bg-primary/20 hover:bg-primary/60 dark:hover:bg-primary/10 cursor-pointer px-2 py-0.5 rounded-sm ",
            page === 1 ? "hidden" : "flex"
          )}
        >
          1
        </button>
        <div className="px-2 py-0.5 border border-primary rounded-sm cursor-default">
          {page}
        </div>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          className={cn(
            "border border-primary bg-primary/40 dark:bg-primary/20 hover:bg-primary/60 dark:hover:bg-primary/10 cursor-pointer px-2 py-0.5 rounded-sm ",
            page === totalPages ? "hidden" : "flex"
          )}
        >
          {totalPages}
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={cn(
            "border border-primary bg-primary/40 dark:bg-primary/20 hover:bg-primary/60 dark:hover:bg-primary/10 cursor-pointer px-2 py-0.5 rounded-sm ",
            page === totalPages
              ? "opacity-50 cursor-default hover:bg-primary/40 dark:hover:bg-primary/20"
              : ""
          )}
        >
          {t("Next")}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
