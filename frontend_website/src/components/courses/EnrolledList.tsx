"use client";

import React from "react";
import { User } from "@/types/types";
import CustomButton from "@/components/ui/customButton";

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
};

const EnrolledList: React.FC<Props> = ({
  users,
  role,
  pendingChanges,
  setPendingChanges,
}) => {
  const handleRemove = (userId: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      removed: [...prev.removed, { userId }],
      added: prev.added.filter((u) => u.userId !== userId),
    }));
  };

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {users?.length === 0 && (
        <p className="text-sm text-muted-foreground">No {role}s yet</p>
      )}

      {users?.map((user) => {
        const isPendingRemove = pendingChanges.removed.some(
          (u) => u.userId === user.id,
        );
        const isPendingAdd = pendingChanges.added.some(
          (u) => u.userId === user.id && u.role === role,
        );

        if (isPendingRemove) return null;

        return (
          <div
            key={user.id}
            className={`flex justify-between items-center p-2 border rounded-sm ${
              isPendingAdd ? "bg-green-100" : ""
            }`}
          >
            <div>
              <span className="font-medium">{user.name}</span>{" "}
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <CustomButton
              onClick={() => handleRemove(user.id)}
              variants="outline"
            >
              Remove
            </CustomButton>
          </div>
        );
      })}
    </div>
  );
};

export default EnrolledList;
