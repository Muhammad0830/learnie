"use client";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = ({
  toggleTheme,
  currentTheme,
}: {
  toggleTheme: () => void;
  currentTheme: string | undefined;
}) => {
  return (
    <button
      type="submit"
      onClick={toggleTheme}
      className={`relative cursor-pointer flex justify-center items-center overflow-hidden p-2 rounded-lg transition-all ${
        currentTheme === "dark" ? "hover:bg-[#172554]" : "hover:bg-[#e5e7eb]"
      }`}
      style={{
        border: `1px solid ${currentTheme === "dark" ? "#4b5563" : "#d1d5db"}`,
      }}
    >
      <motion.div
        initial={
          currentTheme === "light"
            ? {
                rotate: 90,
                y: "-150%",
              }
            : { rotate: 0, y: 0 }
        }
        animate={
          currentTheme === "dark"
            ? { rotate: 0, y: 0 }
            : { rotate: 90, y: "-150%" }
        }
      >
        <Sun className="w-5 h-5" color="orange" />
      </motion.div>
      <motion.div
        className="absolute"
        initial={
          currentTheme === "dark"
            ? { rotate: 90, y: "150%" }
            : { rotate: 0, y: 0 }
        }
        animate={
          currentTheme === "light"
            ? { rotate: 0, y: 0 }
            : { rotate: 90, y: "150%" }
        }
      >
        <Moon className="w-5 h-5 text-black" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
