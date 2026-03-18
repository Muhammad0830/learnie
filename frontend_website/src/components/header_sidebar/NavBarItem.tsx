"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const baseClass =
  "text-black dark:text-white px-3 py-1.5 w-full rounded-sm flex items-center transition-colors duration-100";

const activeClass = "bg-primary text-white";

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

  const isActive = pathName === item.url || pathName.startsWith(item.url + "/");

  return (
    <Link
      href={item.url}
      className={cn(
        baseClass,
        "hover:bg-primary hover:text-white",
        isActive && activeClass,
      )}
    >
      {/* ICON */}
      <motion.div
        animate={{ marginRight: collapsed ? 0 : 8 }}
        transition={{ duration: 0.2 }}
        className="ml-0.5 py-0.5"
      >
        {item.icon}
      </motion.div>

      {/* LABEL */}
      {!collapsed && (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap text-base/4"
        >
          {t(item.label)}
        </motion.div>
      )}
    </Link>
  );
};

export default NavBarItem;
