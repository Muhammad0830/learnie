"use client";
import { EachCourseResponseData, Student, Teacher } from "@/types/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";

const CourseConnectedUsersDialog = ({
  users,
  icon,
  title,
  emptyText,
  link,
}: {
  users:
    | EachCourseResponseData["teachers"]
    | EachCourseResponseData["students"];
  icon: React.ReactNode;
  title: string;
  emptyText: string;
  link: string;
}) => {
  const t = useTranslations("Courses");
  const [isOpen, setIsOpen] = useState(false);
  const [fitleredUsers, setFitleredUsers] = useState(users);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filtered = users.filter(
      (user: Student | Teacher) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        ("studentId" in user && user.studentId.includes(search.toLowerCase()))
    );
    setFitleredUsers(filtered); //eslint-disable-line
  }, [search, setFitleredUsers, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="border border-primary bg-primary/5 rounded-md p-3">
      <div className="flex justify-between items-center  mb-2">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {icon} {title}
        </h3>
        {users.length > 5 && (
          <button
            onClick={() => setIsOpen(true)}
            className="sm:px-3 sm:py-1 px-2 py-0.5 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
          >
            <span className="sm:flex hidden">{t(`View all ${link}`)}</span>
            <span className="sm:hidden flex">{t(`View all`)}</span>
          </button>
        )}
      </div>

      {users.length ? (
        <div>
          <ul className="list-disc ml-6 space-y-1">
            {users.map((user, index) => {
              if (index < 5)
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <li key={user.id} className="font-medium">
                      <span>{user.name}</span>
                    </li>

                    <Link
                      href={`/${link}/view/${user.id}`}
                      className="sm:px-2 sm:py-1 p-1.5 flex gap-2 items-center rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sm:flex hidden">{t("View")}</span>
                    </Link>
                  </div>
                );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-sm">{emptyText}</p>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[600px]! sm:w-[50vw]! w-[80vw] max-sm:max-w-[500px]! sm:min-w-[500px]! min-w-[300px]! max-h-[90vh]! h-[90vh] flex-col flex overflow-y-auto p-4 z-9999">
          <div className="flex-1 overflow-y-auto">
            <DialogTitle className="lg:text-2xl text-xl">{title}</DialogTitle>

            <div>
              <input
                type="text"
                value={search}
                onChange={handleChange}
                className="mt-2 mb-4 w-full px-2 py-1.5 border border-primary rounded-sm"
                placeholder={t("Type to search")}
              />
            </div>

            <div className="px-2 flex flex-col gap-2 flex-1">
              {fitleredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "font-medium flex justify-between items-center",
                    fitleredUsers.length - 1 !== index &&
                      "border-b border-b-primary/40 pb-2"
                  )}
                >
                  <div>
                    <span>{user.name}</span>{" "}
                    <span className="text-sm">
                      {"studentId" in user && `(${user.studentId})`}
                    </span>
                  </div>
                  <Link
                    href={`/${link}/view/${user.id}`}
                    className="p-1 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <DialogClose asChild>
            <div className="flex justify-end">
              <button className="px-6 py-2 rounded-sm border border-primary bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40 cursor-pointer">
                {t("Close")}
              </button>
            </div>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseConnectedUsersDialog;
