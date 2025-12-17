"use client";
import { useTranslations } from "next-intl";
import React from "react";

const Page = () => {
  const t = useTranslations();

  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="lg:text-3xl sm:text-2xl text-xl font-bold">403</h1>
      <h2 className="lg:text-2xl sm:text-xl text-lg font-semibold">{t("This page is forbidden")}</h2>
    </div>
  );
};

export default Page;
