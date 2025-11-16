import { Link, usePathname } from "@/i18n/navigation";
import { usePathname as useNextPathName } from "next/navigation";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const LangDropDown = ({
  setLangDropdownOpen,
  langDropdownOpen,
  currentTheme,
  backgroundColor,
}: {
  setLangDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  langDropdownOpen: boolean;
  currentTheme?: string;
  backgroundColor?: string;
}) => {
  const pathName = usePathname();
  const nextPathName = useNextPathName();

  return (
    <div className="relative flex justify-center items-center z-999">
      <button
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        type="button"
        className={cn(
          "z-10 relative cursor-pointer p-2 rounded-lg transition-all bg-background-secondary",
          currentTheme === "dark"
            ? "hover:bg-[#172554] border border-[#4b5563]"
            : "hover:bg-[#e5e7eb] border border-[#d1d5db]",
          `bg-${backgroundColor}`
        )}
        aria-label="Tilni tanlash"
      >
        <Globe
          className="w-5 h-5"
          color={currentTheme === "dark" ? "white" : "black"}
        />
      </button>
      <motion.div
        initial={{ top: "90%", opacity: 0.5, scale: 0, right: "10%" }}
        animate={
          langDropdownOpen
            ? { top: "115%", opacity: 1, scale: 1, right: "0%" }
            : { top: "90%", opacity: 0.5, scale: 0, right: "10%" }
        }
        transition={{ type: "spring", duration: 0.3, ease: "easeIn" }}
        className={cn(
          "z-1 overflow-hidden absolute flex flex-col gap-1 p-2 rounded-sm bg-background-secondary border border-[#d1d5db] dark:border-[#4b5563] origin-top-right",
          backgroundColor && `bg-${backgroundColor}`
        )}
      >
        <Link
          href={pathName}
          onClick={() => setLangDropdownOpen(false)}
          locale="uz"
          className={cn(
            "z-1 px-2 py-0.5 hover:bg-primary rounded-sm transition-colors duration-150 text-black dark:text-white",
            nextPathName.includes("/uz") && "bg-primary/50"
          )}
        >
          O&apos;zbekcha
        </Link>
        <Link
          href={pathName}
          onClick={() => setLangDropdownOpen(false)}
          locale="ru"
          className={cn(
            "z-1 px-2 py-0.5 hover:bg-primary rounded-sm transition-colors duration-150 text-black dark:text-white",
            nextPathName.includes("/ru") && "bg-primary/50"
          )}
        >
          Русский
        </Link>
        <Link
          href={pathName}
          onClick={() => setLangDropdownOpen(false)}
          locale="en"
          className={cn(
            "z-1 px-2 py-0.5 hover:bg-primary rounded-sm transition-colors duration-150 text-black dark:text-white",
            nextPathName.includes("/ru") && "bg-primary/50"
          )}
        >
          English
        </Link>
      </motion.div>
    </div>
  );
};

export default LangDropDown;
