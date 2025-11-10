"use client";
import { Menu, X } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  url: string;
}

const MenuSheet = ({
  menuOpen,
  setMenuOpen,
  navLinksData,
}: {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinksData: NavLinkProps[];
}) => {
  const t = useTranslations("NavBar");
  const pathName = usePathname();

  return (
    <div className="md:hidden flex">
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden flex cursor-pointer p-1.5 rounded-md border dark:border-[#4b5563] border-[#D1D5DB] dark:hover:bg-[#172554] hover:bg-[#e5e7eb] transition-colors duration-150"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.2, type: "tween" }}
            className="fixed inset-0 z-9999 bg-black/70 backdrop-blur-md"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 rounded-sm border border-red-600 text-red-600 absolute right-4 top-4 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center items-center h-full text-white">
              <div className="flex gap-2 flex-col">
                {navLinksData.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{
                      duration: 0.1,
                      type: "tween",
                      delay: index * 0.05 + 0.1,
                    }}
                    key={index}
                  >
                    <Link
                      href={item.url}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex relative items-center justify-between gap-4 px-3 py-2 rounded overflow-hidden bg-black",
                        pathName.startsWith(item.url) && "bg-primary/40"
                      )}
                    >
                      <div className="inset-0 absolute z-0 bg-primary/20 rounded" />
                      <span>{t(item.label)}</span>
                      {item.icon}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuSheet;
