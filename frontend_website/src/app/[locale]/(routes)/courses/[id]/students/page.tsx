"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import useApiQuery from "@/hooks/useApiQuery";
import { Student } from "@/types/types";
import Link from "next/link";
import { useState, useMemo } from "react";
import CustomButton from "@/components/ui/customButton";
import { Eye } from "lucide-react";

interface StudentWithCourseName extends Student {
  courseName: string;
}

const StudentsPage = () => {
  const { id } = useParams();
  const t = useTranslations("Courses");

  const { data, isLoading } = useApiQuery<StudentWithCourseName[]>(
    `/courses/${id}/users?role=student`,
    { key: ["course-students"] }
  );

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (std) =>
        std.name.toLowerCase().includes(search.toLowerCase()) ||
        std.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        std.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  if (isLoading) return <div className="mb-10">{t("Loading")}...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold flex sm:flex-row flex-col sm:gap-1">
          <span>{data?.[0].courseName}:</span> <span>{t("Students")}</span>
        </h1>

        <Link href={`/courses/${id}/view`}>
          <CustomButton variants="outline">
            <span className="max-sm:hidden">{t("Back to course")}</span>
            <span className="sm:hidden">{t("Back")}</span>
          </CustomButton>
        </Link>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("Type to search")}
        className="px-3 py-2 w-full border border-primary rounded-sm mb-4"
      />

      {/* STUDENTS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p>{t("no students found")}</p>
        ) : (
          filtered.map((std) => (
            <div
              key={std.id}
              className="border border-primary/40 p-2 rounded-md flex justify-between items-center bg-primary/5"
            >
              <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-2 w-full">
                <div className="sm:flex-1">
                  <p className="font-semibold">{std.name}</p>
                  <p className="text-sm flex gap-1">
                    <span className="lg:flex sm:hidden flex">
                      {t("Email")}:
                    </span>{" "}
                    {std.email}
                  </p>
                </div>

                <div className="sm:flex-1">
                  <p className="text-sm flex gap-1">
                    <span className="lg:flex hidden">{t("Student ID")}:</span>
                    <span className="lg:hidden flex">{t("ID")}:</span>{" "}
                    {std.studentId}
                  </p>

                  {std.phoneNumber && (
                    <p className="text-sm flex gap-1">
                      <span className="lg:flex hidden">
                        {t("PhoneNumber")}:
                      </span>
                      {std.phoneNumber}
                    </p>
                  )}
                </div>

                <Link
                  href={`/students/${std.id}/view`}
                  className="p-2 sm:flex hidden rounded-sm border border-primary bg-primary/20 hover:bg-primary/30"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>

              <Link
                href={`/students/${std.id}/view`}
                className="p-2 sm:hidden flex rounded-sm border border-primary bg-primary/20 hover:bg-primary/30"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
