"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import useApiQuery from "@/hooks/useApiQuery";
import { Teacher } from "@/types/types";
import Link from "next/link";
import { useState, useMemo } from "react";
import CustomButton from "@/components/ui/customButton";
import { Eye } from "lucide-react";

interface TeacherWithCourseName extends Teacher {
  courseName: string;
}

const TeachersPage = () => {
  const { id } = useParams();
  const t = useTranslations("Courses");

  const { data, isLoading } = useApiQuery<TeacherWithCourseName[]>(
    `/courses/${id}/users?role=teacher`,
    { key: ["course-teachers"] }
  );

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (tch) =>
        tch.name.toLowerCase().includes(search.toLowerCase()) ||
        tch.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold flex sm:flex-row flex-col sm:gap-1">
            <span>{t("Teachers")}</span>
          </h1>

          <Link href={`/courses/${id}/view`}>
            <CustomButton variants="outline">
              <span className="max-sm:hidden">{t("Back to course")}</span>
              <span className="sm:hidden">{t("Back")}</span>
            </CustomButton>
          </Link>
        </div>

        <div className="flex justify-center items-center min-h-[100px] w-full border border-primary bg-primary/5 rounded-md">
          {t("No teachers found")}
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="mb-10">{t("Loading")}...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold flex sm:flex-row flex-col sm:gap-1">
          <span>{data?.[0]?.courseName}:</span> <span>{t("Teachers")}</span>
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

      {/* TEACHERS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p>{t("no teachers found")}</p>
        ) : (
          filtered.map((tch) => (
            <div
              key={tch.id}
              className="border border-primary/40 p-3 rounded-md flex justify-between items-center bg-primary/5"
            >
              <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:gap-2 w-full">
                <div className="sm:flex-1">
                  <p className="font-semibold">{tch.name}</p>
                </div>

                <div className="sm:flex-1">
                  <p className="text-sm flex gap-1">
                    <span className="lg:flex sm:hidden flex">
                      {t("Email")}:
                    </span>{" "}
                    <span>{tch.email}</span>
                  </p>

                  {tch.phoneNumber && (
                    <p className="text-sm flex gap-1">
                      <span className="lg:flex hidden">
                        {t("PhoneNumber")}:
                      </span>
                      {tch.phoneNumber}
                    </p>
                  )}
                </div>

                <Link
                  href={`/students/${tch.id}/view`}
                  className="p-2 sm:flex hidden rounded-sm border border-primary bg-primary/20 hover:bg-primary/30"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>

              <Link
                href={`/teachers/${tch.id}/view`}
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

export default TeachersPage;
