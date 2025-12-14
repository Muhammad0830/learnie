"use client";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import Link from "next/link";

const ProfileButton = ({ collapsed }: { collapsed: boolean }) => {
  const pathName = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="w-full flex justify-center items-center relative p-2">
      <Link
        href={"/profile"}
        className={cn(
          "text-black dark:text-white border border-primary hover:border-white px-2 py-1.5 w-full group rounded-sm cursor-pointer hover:bg-primary hover:text-white flex items-center transition-colors duration-100",
          pathName.includes("/profile") && "bg-primary text-white border-white"
        )}
      >
        <AnimatePresence>
          <motion.div
            initial={{ marginRight: 8 }}
            animate={collapsed ? { marginRight: 0 } : { marginRight: 8 }}
            layout
          >
            <div
              className={cn(
                "p-1 rounded-full border border-primary group-hover:border-white transition-colors duration-100",
                pathName.includes("/profile") && "border-white"
              )}
            >
              <User className="w-5 h-5" />
            </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap text-base/4 flex flex-col gap-0.5 w-full"
            >
              <span className="text-base/4 font-bold w-full truncate">
                {user.name}
              </span>
              <span className="text-xs/3 text-foreground/70 w-full group-hover:text-white/70 truncate transition-colors duration-100">
                {user.email}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
};

export default ProfileButton;
