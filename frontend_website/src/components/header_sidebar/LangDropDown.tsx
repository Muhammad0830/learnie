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
}: {
  setLangDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  langDropdownOpen: boolean;
  currentTheme?: string;
}) => {
  const pathName = usePathname();
  const nextPathName = useNextPathName();

  return (
    <div className="relative flex justify-center items-center">
      <button
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        type="button"
        className={cn(
          "z-10 relative cursor-pointer p-2 rounded-lg transition-all bg-background-secondary",
          currentTheme === "dark"
            ? "hover:bg-[#172554] border border-[#4b5563]"
            : "hover:bg-[#e5e7eb] border border-[#d1d5db]"
        )}
        aria-label="Tilni tanlash"
      >
        <Globe
          className="w-5 h-5"
          color={currentTheme === "dark" ? "white" : "black"}
        />
      </button>
      <motion.div
        initial={{ top: "90%", opacity: 0.5, scale: 0 }}
        animate={
          langDropdownOpen
            ? { top: "115%", opacity: 1, scale: 1 }
            : { top: "90%", opacity: 0.5, scale: 0 }
        }
        transition={{ type: "spring", duration: 0.3, ease: "easeIn" }}
        className="z-1 overflow-hidden absolute right-[20%] flex flex-col gap-1 p-2 rounded-sm bg-background-secondary border border-[#d1d5db] dark:border-[#4b5563] origin-top-right"
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
      </motion.div>
    </div>
  );
};

export default LangDropDown;
