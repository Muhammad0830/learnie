"use client";

import React, { useEffect, useMemo, useState } from "react";
import { User } from "@/types/types";
import { useTranslations } from "next-intl";
import { DataTable } from "../TableComponents/DataTable";
import Pagination from "../TableComponents/Pagination";
import { columns } from "./AttachedUsersTableColumns";

interface UserProps extends User {
  isPendingAdd?: boolean;
  isPendingRemove?: boolean;
}

type Props = {
  courseId: string;
  users: User[];
  role: "student" | "teacher";
  pendingChanges: {
    added: { userId: string; role: "student" | "teacher" }[];
    removed: { userId: string }[];
  };
  setPendingChanges: React.Dispatch<
    React.SetStateAction<{
      added: { userId: string; role: "student" | "teacher" }[];
      removed: { userId: string }[];
    }>
  >;
  isCourseLoading: boolean;
};

const EnrolledList: React.FC<Props> = ({
  users,
  role,
  pendingChanges,
  setPendingChanges,
  isCourseLoading,
}) => {
  const t = useTranslations("Courses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const limit = 10;

  const updatedUsers = useMemo(() => {
    return users.filter((user) => {
      const isPendingRemove = pendingChanges.removed.some(
        (u) => u.userId === user.id,
      );
      const isPendingAdd = pendingChanges.added.some(
        (u) => u.userId === user.id && u.role === role,
      );

      if (isPendingRemove) return null;

      if (user.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
        return { ...user, isPendingAdd, isPendingRemove };
      else if (user.email.toLowerCase().includes(debouncedSearch.toLowerCase()))
        return { ...user, isPendingAdd, isPendingRemove };
      else if (
        user.studentId?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
        return { ...user, isPendingAdd, isPendingRemove };

      return null;
    });
  }, [users, pendingChanges, role, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleRemove = (userId: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      removed: [...prev.removed, { userId }],
      added: prev.added.filter((u) => u.userId !== userId),
    }));
  };

  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div>
      {users?.length === 0 && (
        <p className="text-sm text-muted-foreground">No {role}s yet</p>
      )}

      <input
        type="text"
        className="flex w-full mb-2 h-full p-2 pl-3 rounded bg-primary/20 dark:bg-primary/30 border border-foreground"
        placeholder={`Search ${role}s...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="relative z-0 mb-2">
        <DataTable
          isLoading={isCourseLoading}
          columns={columns(handleRemove, t, role)}
          data={updatedUsers as UserProps[]}
          translateFrom={"Courses"}
        />
      </div>

      {/* Pagination */}
      <Pagination
        totalUsers={totalUsers}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
        translateFrom={"Courses"}
      />
    </div>
  );
};

export default EnrolledList;
