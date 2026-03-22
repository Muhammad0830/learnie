"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import EnrolledList from "./EnrolledList";
import UserSearchList from "./UserSearchList";
import { User, Role } from "@/types/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  courseId: string;
  students: User[];
  teachers: User[];
  pendingChanges: {
    added: { userId: string; role: Role }[];
    removed: { userId: string }[];
  };
  setPendingChanges: React.Dispatch<
    React.SetStateAction<{
      added: { userId: string; role: Role }[];
      removed: { userId: string }[];
    }>
  >;
  isCourseLoading: boolean;
};

const UsersSection: React.FC<Props> = ({
  courseId,
  students,
  teachers,
  pendingChanges,
  setPendingChanges,
  isCourseLoading,
}) => {
  const t = useTranslations("Courses");
  const roles: Role[] = ["student", "teacher"];
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [mode, setMode] = useState<"enrolled" | "add">("enrolled");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const usersByRole = useMemo(
    () => (selectedRole === "student" ? students : teachers),
    [selectedRole, students, teachers],
  );

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">{t("Users Attachment")} </h2>

      <TabGroup
        selectedIndex={roles.indexOf(selectedRole)}
        onChange={(index) => setSelectedRole(roles[index])}
      >
        <div className="flex gap-2 items-center mb-4">
          <TabList className="flex">
            <div className="flex bg-primary/5 border border-primary rounded-md relative overflow-hidden">
              {roles.map((role) => (
                <Tab
                  key={role}
                  className={({ selected }) =>
                    cn(
                      "px-3 py-1.5 cursor-pointer",
                      role === "student" ? "rounded-l-md" : "rounded-r-md",
                      selected
                        ? "bg-primary/30 border-primary"
                        : "border-gray-300",
                    )
                  }
                >
                  {role === "student" ? "Students" : "Teachers"}
                </Tab>
              ))}
            </div>
          </TabList>
          <TabList className="flex">
            <div className="flex bg-primary/5 border border-primary rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setMode("enrolled")}
                className={cn(
                  "px-3 py-1.5 cursor-pointer rounded-l-md",
                  mode === "enrolled" ? "bg-primary/30" : "",
                )}
              >
                {t("Enrolled")}
              </button>
              <button
                type="button"
                onClick={() => setMode("add")}
                className={cn(
                  "px-3 cursor-pointer py-1.5 rounded-r-md",
                  mode === "add" ? "bg-primary/30" : "",
                )}
              >
                {t("Add")}
              </button>
            </div>
          </TabList>
        </div>

        {mode === "enrolled" ? (
          <EnrolledList
            courseId={courseId}
            users={usersByRole}
            role={selectedRole}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
            isCourseLoading={isCourseLoading}
            search={search}
            setSearch={setSearch}
            debouncedSearch={debouncedSearch}
          />
        ) : (
          <UserSearchList
            courseId={courseId}
            role={selectedRole}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
            search={search}
            setSearch={setSearch}
            debouncedSearch={debouncedSearch}
          />
        )}
      </TabGroup>
    </div>
  );
};

export default UsersSection;
