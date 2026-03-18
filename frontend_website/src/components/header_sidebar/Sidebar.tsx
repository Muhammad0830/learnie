"use client";

import {
  LayoutDashboard,
  Settings,
  GanttChartSquare,
  Presentation,
  ShieldUser,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import NavBarItem from "./NavBarItem";
import { motion } from "framer-motion";
import NextLink from "next/link";
import ProfileButton from "./ProfileButton";
import LangDropDown from "./LangDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPersonChalkboard,
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";
import MenuSheet from "./MenuSheet";
import { useAuth } from "@/context/AuthContext";
import { NavItem } from "@/types/types";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 65;

const NAV_ITEMS = {
  dashboard: {
    icon: <LayoutDashboard className="w-5 h-6" />,
    label: "dashboard",
    url: "/dashboard",
  },
  students: {
    icon: <FontAwesomeIcon icon={faGraduationCap} className="w-5 h-5" />,
    label: "Students",
    url: "/students",
  },
  teachers: {
    icon: <FontAwesomeIcon icon={faPersonChalkboard} className="w-5 h-5" />,
    label: "Teachers",
    url: "/teachers",
  },
  courses: {
    icon: <Presentation className="w-5 h-6" />,
    label: "Courses",
    url: "/courses",
  },
  admins: {
    icon: <ShieldUser className="w-5 h-6" />,
    label: "Admins",
    url: "/admins",
  },
  settings: {
    icon: <Settings className="w-5 h-6" />,
    label: "Settings",
    url: "/settings",
  },
};

const ROLE_NAV_MAP: { [key: string]: NavItem[] } = {
  admin: [
    NAV_ITEMS.dashboard,
    NAV_ITEMS.students,
    NAV_ITEMS.teachers,
    NAV_ITEMS.courses,
    NAV_ITEMS.admins,
    NAV_ITEMS.settings,
  ],
  teacher: [
    NAV_ITEMS.dashboard,
    NAV_ITEMS.students,
    NAV_ITEMS.courses,
    NAV_ITEMS.settings,
  ],
  default: [NAV_ITEMS.dashboard, NAV_ITEMS.courses, NAV_ITEMS.settings],
};

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAuth();
  const { theme: currentTheme, setTheme } = useTheme();

  const navLinksData = useMemo(() => {
    if (!user?.role) return ROLE_NAV_MAP.default;
    return ROLE_NAV_MAP[user.role] || ROLE_NAV_MAP.default;
  }, [user?.role]);

  useEffect(() => {
    setMounted(true); // eslint-disable-line

    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="h-screen flex">
      {/* ================= SIDEBAR ================= */}
      <motion.div
        className="w-60 md:flex hidden flex-col border-r border-r-black/50 dark:border-r-white bg-background-secondary overflow-hidden"
        initial={{ width: SIDEBAR_WIDTH }}
        animate={{
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        }}
      >
        {/* LOGO */}
        <NextLink
          href="/"
          className="w-full h-16 text-black dark:text-white px-4 py-2 flex items-center border-b border-b-black dark:border-b-white"
        >
          <motion.div
            animate={{ marginRight: collapsed ? 0 : 8 }}
            className="ml-px"
          >
            <GanttChartSquare
              className="w-8 h-8"
              color={currentTheme === "dark" ? "white" : "black"}
            />
          </motion.div>

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap lg:text-2xl text-lg font-bold"
            >
              Learnie
            </motion.div>
          )}
        </NextLink>

        {/* NAV + PROFILE */}
        <div className="flex-1 flex flex-col justify-between">
          {/* NAV */}
          <div className="flex flex-col items-center gap-1 p-2">
            {navLinksData.map((item: NavItem) => (
              <NavBarItem key={item.url} collapsed={collapsed} item={item} />
            ))}
          </div>

          {/* PROFILE */}
          <ProfileButton collapsed={collapsed} />
        </div>
      </motion.div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 h-screen overflow-hidden">
        {/* HEADER */}
        <div className="bg-background-secondary px-4 h-16 flex items-center border-b border-bottom-[#d1d5db] justify-between text-black dark:text-white">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <MenuSheet
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              navLinksData={navLinksData}
            />

            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="md:flex hidden w-7 h-7 border border-black dark:border-white rounded-sm cursor-pointer hover:border-primary group transition-colors duration-150"
            >
              <div className="translate-x-2 h-full w-px bg-black dark:bg-white group-hover:bg-primary transition-colors duration-150" />
            </button>
          </div>

          {/* CENTER */}
          {collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="whitespace-nowrap lg:text-2xl text-lg font-bold"
            >
              Learnie
            </motion.div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <ThemeToggle
              toggleTheme={toggleTheme}
              currentTheme={currentTheme}
            />

            <LangDropDown
              currentTheme={currentTheme}
              langDropdownOpen={langDropdownOpen}
              setLangDropdownOpen={setLangDropdownOpen}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div
          className={cn(
            "lg:p-6 p-4 h-[calc(100svh-64px)] overflow-y-auto",
            currentTheme === "dark" ? "bg-black" : "bg-white",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
