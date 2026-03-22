"use client";

import React, { useMemo, useState } from "react";
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
    added: { user: UserProps }[];
    removed: { user: UserProps }[];
  };
  isCourseLoading: boolean;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearch: string;
  handleRemove: (user: UserProps) => void;
  handleUndoRemove: (user: UserProps) => void;
};

const EnrolledList: React.FC<Props> = ({
  users,
  role,
  pendingChanges,
  isCourseLoading,
  search,
  setSearch,
  debouncedSearch,
  handleRemove,
  handleUndoRemove,
}) => {
  const t = useTranslations("Courses");
  const [page, setPage] = useState(1);
  const limit = 10;

  const updatedUsers = useMemo(() => {
    const newUsers = users.map((user) => {
      const isPendingRemove = pendingChanges.removed.some(
        (u) => u.user.id === user.id,
      );
      const isPendingAdd = pendingChanges.added.some(
        (u) => u.user.id === user.id,
      );

      return { ...user, isPendingAdd, isPendingRemove };
    });

    const conditions = (user: UserProps) =>
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.studentId?.toLowerCase().includes(debouncedSearch.toLowerCase());

    return newUsers.filter((user) => {
      if (debouncedSearch === "" || conditions(user)) {
        return user;
      } else return null;
    });
  }, [users, pendingChanges, debouncedSearch]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;

    return updatedUsers.slice(start, end);
  }, [updatedUsers, page]);

  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="flex flex-col gap-2">
      {users?.length === 0 && (
        <p className="text-sm text-muted-foreground">No {role}s yet</p>
      )}

      <input
        type="text"
        className="flex w-full h-full p-2 pl-3 rounded bg-primary/20 dark:bg-primary/30 border border-foreground"
        placeholder={`Search ${role}s...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="relative z-0 mb-2">
        <DataTable
          isLoading={isCourseLoading}
          columns={columns(handleRemove, handleUndoRemove, t, role)}
          data={paginatedUsers as UserProps[]}
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
