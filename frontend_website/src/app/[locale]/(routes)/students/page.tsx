"use client";

import { DataTable } from "@/components/students/DataTable";
import Pagination from "@/components/students/Pagination";
import { columns } from "@/components/students/TableColumns";
import useApiQuery from "@/hooks/useApiQuery";
import { StudentListResponse } from "@/types/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const t = useTranslations("Students");
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data: studentsData,
    isLoading,
    refetch,
  } = useApiQuery<StudentListResponse>(
    `/users?role=student&page=${page}&limit=${limit}`,
    { key: ["students", page, limit] }
  );

  const {
    students: data,
    totalStudents,
    totalPages,
  } = studentsData
    ? studentsData
    : { students: [], totalStudents: 0, totalPages: 0 };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Students")}
        </h1>
        <Link
          href={"/students/create"}
          className="rounded-sm px-3 py-1.5 cursor-pointer bg-primary/30 hover:bg-primary/60 dark:bg-primary/50 dark:hover:bg-primary/30 border border-primary text-black dark:text-white sm:text-[16px] text-xs"
        >
          {t("Create New")}
        </Link>
      </div>

      {/* search & filter */}
      <div className="flex gap-2 items-center justify-between w-full mb-4 z-10 relative">
        <div className="md:min-w-[250px] lg:min-w-[300px] min-w-[200px] w-[30%] h-8">
          <input
            type="text"
            className="w-full h-full p-2 rounded-sm bg-primary/30 dark:bg-primary/50 border border-primary"
            placeholder={`${t("type to search")}`}
          />
        </div>
      </div>

      {/* table */}
      <div className="relative z-0 mb-2">
        <DataTable columns={columns(refetch)} data={data} />
      </div>

      <Pagination
        totalStudents={totalStudents}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Page;
