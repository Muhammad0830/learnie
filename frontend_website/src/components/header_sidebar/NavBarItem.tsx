"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NavBarItem = ({
  item,
  collapsed,
}: {
  item: {
    label: string;
    icon: React.ReactNode;
    url: string;
  };
  collapsed: boolean;
}) => {
  const t = useTranslations("NavBar");
  const pathName = usePathname();

  return (
    <motion.div className="flex flex-col w-full">
      <Link
        href={item.url}
        className={cn(
          "text-black dark:text-white px-3 py-1.5 w-full rounded-sm cursor-pointer hover:bg-primary hover:text-white flex items-center transition-colors duration-100 z-100",
          pathName.startsWith(item.url) && "bg-primary text-white"
        )}
      >
        <motion.div
          initial={{ marginRight: 8 }}
          animate={collapsed ? { marginRight: 0 } : { marginRight: 8 }}
          transition={{ duration: 0.2 }}
          layout
          className="ml-0.5 py-0.5"
        >
          {item.icon}
        </motion.div>
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed && (
            <motion.div
              layout
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
    </motion.div>
  );
};

export default NavBarItem;
