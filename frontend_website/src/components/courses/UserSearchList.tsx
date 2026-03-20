"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/types";
import CustomButton from "@/components/ui/customButton";
import useApiQuery from "@/hooks/useApiQuery";
import { debounce } from "lodash";

type Props = {
  courseId: string;
  role: "student" | "teacher";
  currentUsers: User[];
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
};

const UserSearchList: React.FC<Props> = ({
  courseId,
  role,
  currentUsers,
  pendingChanges,
  setPendingChanges,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: users, isLoading } = useApiQuery<User[]>(
    `/users?search=${debouncedSearch}&excludeCourseId=${courseId}&role=${role}`,
    { key: [`users-search-${role}-${debouncedSearch}`] },
  );

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleAdd = (user: User) => {
    setPendingChanges((prev) => ({
      added: [...prev.added, { userId: user.id, role }],
      removed: prev.removed.filter((u) => u.userId !== user.id),
    }));
  };

  const isAlreadyAdded = (userId: string) =>
    pendingChanges.added.some((u) => u.userId === userId) ||
    currentUsers.some((u) => u.id === userId);

  return (
    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search ${role}s...`}
        className="mb-2 px-2 py-1 border rounded-sm"
      />
      {isLoading && <p>Loading...</p>}
      {!isLoading && users?.length === 0 && (
        <p className="text-sm text-muted-foreground">No users found</p>
      )}

      {users?.map((user) => {
        const alreadyAdded = isAlreadyAdded(user.id);
        return (
          <div
            key={user.id}
            className={`flex justify-between items-center p-2 border rounded-sm ${
              pendingChanges.added.some((u) => u.userId === user.id)
                ? "bg-green-100"
                : ""
            }`}
          >
            <div>
              <span className="font-medium">{user.name}</span>{" "}
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <CustomButton
              onClick={() => handleAdd(user)}
              variants="outline"
              disabled={alreadyAdded}
            >
              {alreadyAdded ? "Added" : "Add"}
            </CustomButton>
          </div>
        );
      })}
    </div>
  );
};

export default UserSearchList;
