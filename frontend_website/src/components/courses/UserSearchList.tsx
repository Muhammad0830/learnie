"use client";

import React, { useState, useMemo } from "react";
import { StudentListResponse, User } from "@/types/types";
import useApiQuery from "@/hooks/useApiQuery";
import Pagination from "../TableComponents/Pagination";
import { DataTable } from "../TableComponents/DataTable";
import { useTranslations } from "next-intl";
import { columns } from "./NotEnrolledUsersTableColumns";

interface UserProps extends User {
  isPendingAdd?: boolean;
  isPendingRemove?: boolean;
}

type Props = {
  courseId: string;
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
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearch: string;
};

const UserSearchList: React.FC<Props> = ({
  courseId,
  role,
  pendingChanges,
  setPendingChanges,
  search,
  setSearch,
  debouncedSearch,
}) => {
  const t = useTranslations("Courses");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: users, isLoading } = useApiQuery<StudentListResponse>(
    `/courses/${courseId}/not_enrolled_users?courseId=${courseId}&role=${role}&page=${page}&limit=${limit}&search=${debouncedSearch}`,
    {
      key: ["enrolled_users", page, limit, debouncedSearch, role],
      enabled: true,
    },
  );

  const updatedUsers = useMemo(() => {
    return users?.users.map((user) => {
      const isPendingRemove = pendingChanges.removed.some(
        (u) => u.userId === user.id,
      );
      const isPendingAdd = pendingChanges.added.some(
        (u) => u.userId === user.id && u.role === role,
      );

      if (isPendingRemove) return null;

      return {
        ...user,
        isPendingRemove,
        isPendingAdd,
      };
    });
  }, [users, pendingChanges, role]);

  const handleAdd = (user: UserProps) => {
    setPendingChanges((prev) => ({
      added: [...prev.added, { userId: user.id, role }],
      removed: prev.removed.filter((u) => u.userId !== user.id),
    }));
  };

  const handleReturn = (user: UserProps) => {
    setPendingChanges((prev) => ({
      added: prev.added.filter((u) => u.userId !== user.id),
      removed: prev.removed,
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="flex w-full h-full p-2 pl-3 rounded bg-primary/20 dark:bg-primary/30 border border-foreground"
        placeholder={`Search ${role}s...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading && <p>Loading...</p>}
      {!isLoading && users?.users.length === 0 && (
        <p className="text-sm text-muted-foreground">No users found</p>
      )}

      <div className="relative z-0 mb-2">
        <DataTable
          isLoading={isLoading}
          columns={columns(handleAdd, handleReturn, t, role)}
          data={updatedUsers as UserProps[]}
          translateFrom={"Courses"}
        />
      </div>

      {/* Pagination */}
      {users ? (
        <Pagination
          totalUsers={users.totalUsers}
          setPage={setPage}
          page={page}
          totalPages={users.totalPages}
          translateFrom={"Courses"}
        />
      ) : null}
    </div>
  );
};

export default UserSearchList;
