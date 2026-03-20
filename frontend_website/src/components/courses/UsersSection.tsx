"use client";

import React, { useState, useMemo } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import EnrolledList from "./EnrolledList";
import UserSearchList from "./UserSearchList";
import { User, Role } from "@/types/types";

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
};

const UsersSection: React.FC<Props> = ({
  courseId,
  students,
  teachers,
  pendingChanges,
  setPendingChanges,
}) => {
  const roles: Role[] = ["student", "teacher"];
  const [selectedRole, setSelectedRole] = useState<Role>("student");

  const usersByRole = useMemo(
    () => (selectedRole === "student" ? students : teachers),
    [selectedRole, students, teachers],
  );

  return (
    <div className="mt-6 border border-primary rounded-md p-4">
      <h2 className="text-xl font-bold mb-2">Users</h2>

      <TabGroup
        selectedIndex={roles.indexOf(selectedRole)}
        onChange={(index) => setSelectedRole(roles[index])}
      >
        <TabList className="flex gap-2 mb-4">
          {roles.map((role) => (
            <Tab
              key={role}
              className={({ selected }) =>
                `px-3 py-1.5 rounded-sm border ${selected ? "bg-primary/30 border-primary" : "border-gray-300"}`
              }
            >
              {role === "student" ? "Students" : "Teachers"}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <TabGroup>
              <TabList className="flex gap-2 mb-2">
                <Tab
                  className={({ selected }) =>
                    `px-2 py-1 rounded-sm border ${selected ? "bg-primary/30 border-primary" : "border-gray-300"}`
                  }
                >
                  Enrolled
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `px-2 py-1 rounded-sm border ${selected ? "bg-primary/30 border-primary" : "border-gray-300"}`
                  }
                >
                  Add
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <EnrolledList
                    courseId={courseId}
                    users={usersByRole}
                    role={selectedRole}
                    pendingChanges={pendingChanges}
                    setPendingChanges={setPendingChanges}
                  />
                </TabPanel>
                <TabPanel>
                  <UserSearchList
                    courseId={courseId}
                    role={selectedRole}
                    currentUsers={usersByRole}
                    pendingChanges={pendingChanges}
                    setPendingChanges={setPendingChanges}
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </TabPanel>
          <TabPanel>
            <TabGroup>
              <TabList className="flex gap-2 mb-2">
                <Tab
                  className={({ selected }) =>
                    `px-2 py-1 rounded-sm border ${selected ? "bg-primary/30 border-primary" : "border-gray-300"}`
                  }
                >
                  Enrolled
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `px-2 py-1 rounded-sm border ${selected ? "bg-primary/30 border-primary" : "border-gray-300"}`
                  }
                >
                  Add
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <EnrolledList
                    courseId={courseId}
                    users={usersByRole}
                    role={selectedRole}
                    pendingChanges={pendingChanges}
                    setPendingChanges={setPendingChanges}
                  />
                </TabPanel>
                <TabPanel>
                  <UserSearchList
                    courseId={courseId}
                    role={selectedRole}
                    currentUsers={usersByRole}
                    pendingChanges={pendingChanges}
                    setPendingChanges={setPendingChanges}
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default UsersSection;
