"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NavBarItem = ({
  item,
  collapsed,
}: {
  item: { label: string; icon: React.ReactNode; url: string };
  collapsed: boolean;
}) => {
  const t = useTranslations("NavBar");
  const pathName = usePathname();

  return (
    <Link
      href={item.url}
      className={cn(
        "text-black dark:text-white px-3 py-2 w-full rounded-sm cursor-pointer hover:bg-primary hover:text-white flex items-center transition-colors duration-100",
        pathName.startsWith(item.url) && "bg-primary text-white"
      )}
    >
      <AnimatePresence>
        <motion.div
          initial={{ marginRight: 8 }}
          animate={collapsed ? { marginRight: 0 } : { marginRight: 8 }}
          layout
          className="ml-0.5"
        >
          {item.icon}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {!collapsed && (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap text-base/4"
          >
            {t(item.label)}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default NavBarItem;
