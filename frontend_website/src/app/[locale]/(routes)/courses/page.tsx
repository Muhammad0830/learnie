"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { debounce } from "lodash";
import useApiQuery from "@/hooks/useApiQuery";
import { CoursesListResponse } from "@/types/types";
import { DataTable } from "@/components/TableComponents/DataTable";
import { columns } from "@/components/courses/TableColumns";
import Pagination from "@/components/TableComponents/Pagination";

const Page = () => {
  const t = useTranslations("Courses");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: coursesData,
    isLoading,
    refetch,
  } = useApiQuery<CoursesListResponse>(`/courses`, {
    key: ["students", page, limit, debouncedSearch],
    enabled: true,
  });

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    []
  );
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    handleSearch(value);
  };

  const {
    courses: data = [],
    totalCourses = 0,
    totalPages = 0,
  } = coursesData || {};

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Courses")}
        </h1>
        <Link
          href={"/courses/create"}
          className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
        >
          {t("Create New")}
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2 items-center justify-between w-full h-10 mb-4 z-10 relative">
        <div className="md:min-w-[350px] lg:min-w-[400px] sm:min-w-[300px] w-full sm:w-[30%] h-full">
          <input
            type="text"
            className="md:hidden flex w-full h-full p-2 pl-3 rounded bg-primary/20 dark:bg-primary/30 border border-foreground"
            placeholder={`${t("type to search")}`}
            value={search}
            onChange={onSearchChange}
          />
          <input
            type="text"
            className="md:flex hidden w-full h-full p-2 pl-3 rounded bg-primary/20 dark:bg-primary/30 border border-foreground"
            placeholder={`${t("type to search")}`}
            value={search}
            onChange={onSearchChange}
            autoFocus
          />
        </div>
      </div>

      {/* table */}
      <div className="relative z-0 mb-2">
        <DataTable
          isLoading={isLoading}
          columns={columns(refetch)}
          data={data}
          translateFrom={"Courses"}
        />
      </div>

      {/* Pagination */}
      <Pagination
        totalUsers={totalCourses}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
        translateFrom={"Courses"}
      />
    </div>
  );
};

export default Page;
