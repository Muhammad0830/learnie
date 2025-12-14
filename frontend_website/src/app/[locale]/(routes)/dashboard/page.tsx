"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import useApiQuery from "@/hooks/useApiQuery";
import { DashboardDataType } from "@/types/types";
import { GraduationCap, Presentation, ShieldUser } from "lucide-react";
import { faPersonChalkboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "@/components/ui/customButton";

const DashboardPage = () => {
  const t = useTranslations("Dashboard");
  const toastT = useTranslations("Toast");

  const { data, isLoading, error } = useApiQuery<DashboardDataType>(
    "/dashboard/summary",
    {
      key: ["dashboard_summary"],
    }
  );

  if (isLoading) {
    return <div className="my-10">{toastT("Loading")}</div>;
  }

  if (error || !data) {
    return <div className="my-10">{t("Something went wrong")}</div>;
  }

  const { counts, recents } = data;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="md:text-2xl text-xl font-bold">{t("Dashboard")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("Overview of the system")}
        </p>
      </div>

      {/* COUNTS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <DashboardCard
          title={t("Students")}
          value={counts.students}
          icon={<GraduationCap className="w-5 h-5" />}
        />
        <DashboardCard
          title={t("Teachers")}
          value={counts.teachers}
          icon={
            <div className="w-5 h-5 flex justify-center items-center">
              <FontAwesomeIcon icon={faPersonChalkboard} className="w-5 h-5" />
            </div>
          }
        />
        <DashboardCard
          title={t("Courses")}
          value={counts.courses}
          icon={<Presentation className="w-5 h-5" />}
        />
        <DashboardCard
          title={t("Admins")}
          value={counts.admins}
          icon={<ShieldUser className="w-5 h-5" />}
        />
      </div>

      {/* RECENTS */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Students */}
        <RecentList
          title={t("Recent Students")}
          items={recents.students}
          emptyText={t("No students found")}
          linkPrefix="/students"
          count={counts.students}
        />

        {/* Recent Teachers */}
        <RecentList
          title={t("Recent Teachers")}
          items={recents.teachers}
          emptyText={t("No teachers found")}
          linkPrefix="/teachers"
          count={counts.teachers}
        />

        {/* Recent Courses */}
        <RecentList
          title={t("Recent Courses")}
          items={recents.courses}
          emptyText={t("No courses found")}
          linkPrefix="/courses"
          count={counts.courses}
        />

        {/* Recent Admins */}
        <RecentList
          title={t("Recent Admins")}
          items={recents.admins}
          emptyText={t("No admins found")}
          linkPrefix="/users/"
          count={counts.admins}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

/* ------------------------------------------------------------------ */
/* COMPONENTS */
/* ------------------------------------------------------------------ */

const DashboardCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <div className="border border-primary/60 dark:border-primary/20 rounded-md p-3 bg-primary/5 flex justify-between items-center">
      <div>
        <p className="text-sm md:text-base text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-primary p-2 rounded-sm border border-primary/80 dark:border-primary/40 bg-white dark:bg-black">
        {icon}
      </div>
    </div>
  );
};

const RecentList = ({
  title,
  items,
  emptyText,
  linkPrefix,
  count,
}: {
  title: string;
  items: { id: string; name: string; created_at: string }[];
  emptyText: string;
  linkPrefix: string;
  count: number;
}) => {
  const t = useTranslations("Dashboard");

  return (
    <div className="border border-primary/60 dark:border-primary/20 rounded-md p-4 bg-primary/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        {count > 5 && (
          <Link href={`${linkPrefix}/`}>
            <CustomButton className="py-0.5 text-sm">
              {t("View all")}
            </CustomButton>
          </Link>
        )}
      </div>

      {Array.isArray(items) && items.length === 0 ? (
        <div className="text-sm text-muted-foreground">{emptyText}</div>
      ) : (
        <ul className="space-y-2">
          {items?.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <Link
                href={`${linkPrefix}/${item.id}/view`}
                className="hover:underline font-medium"
              >
                {item.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
