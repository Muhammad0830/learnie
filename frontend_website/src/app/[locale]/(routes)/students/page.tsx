"use client";

import { DataTable } from "@/components/TableComponents/DataTable";
import Pagination from "@/components/TableComponents/Pagination";
import { columns } from "@/components/students/TableColumns";
import useApiQuery from "@/hooks/useApiQuery";
import { StudentListResponse } from "@/types/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { debounce } from "lodash";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/ui/customButton";
import { useRouter } from "next/navigation";

const Page = () => {
  const t = useTranslations("Students");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const limit = 10;
  const router = useRouter();

  const { user } = useAuth();

  const {
    data: studentsData,
    isLoading,
    refetch,
  } = useApiQuery<StudentListResponse>(
    `/users?role=student&page=${page}&limit=${limit}&search=${debouncedSearch}`,
    { key: ["students", page, limit, debouncedSearch], enabled: true }
  );

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
    users: data = [],
    totalUsers = 0,
    totalPages = 0,
  } = studentsData || {};

  if (!user) {
    return <div>{t("Loading")}</div>;
  }
  console.log("user", user);

  if (user?.role === "student") {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <div className="sm:text-2xl text-xl font-bold">
          {t("You are not authorized to view this page")}
        </div>
        <CustomButton
          onClick={() => {
            router.back();
          }}
          variants="outline"
        >
          {t("Go back")}
        </CustomButton>
      </div>
    );
  } else {
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

        {/* search */}
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
            translateFrom={"Students"}
          />
        </div>

        <Pagination
          totalUsers={totalUsers}
          setPage={setPage}
          page={page}
          totalPages={totalPages}
          translateFrom={"Students"}
        />
      </div>
    );
  }
};

export default Page;
