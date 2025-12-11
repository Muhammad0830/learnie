"use client";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const ProfileButton = ({ collapsed }: { collapsed: boolean }) => {
  const t = useTranslations("NavBar");
  const pathName = usePathname();
  return (
    <div className="w-full flex justify-center items-center relative p-2">
      <Link
        href={"/profile"}
        className={cn(
          "text-black dark:text-white px-3 py-2 w-full rounded-sm cursor-pointer hover:bg-primary hover:text-white flex items-center transition-colors duration-100",
          pathName.includes("/profile") && "bg-primary text-white"
        )}
      >
        <AnimatePresence>
          <motion.div
            initial={{ marginRight: 8 }}
            animate={collapsed ? { marginRight: 0 } : { marginRight: 8 }}
            layout
            className="ml-0.5 py-0.5"
          >
            <User className="w-5 h-5" />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap text-base/4"
            >
              {t("Profile")}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
};

export default ProfileButton;
