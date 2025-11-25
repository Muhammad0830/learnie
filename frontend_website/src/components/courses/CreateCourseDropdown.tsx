"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import CustomButton from "../ui/customButton";
import { useState } from "react";

const createLinks = [
  { label: "Course", href: "/courses/create/courses" },
  { label: "Topic", href: "/courses/create/topics" },
  { label: "Lectures", href: "/courses/create/items?pageType=lecture" },
  { label: "Assignments", href: "/courses/create/items?pageType=assignments" },
  {
    label: "Presentations",
    href: "/courses/create/items?pageType=presentations",
  },
];

const CreateCourseDropdown = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Courses");

  return (
    <div className="relative">
      <CustomButton
        variants="primary"
        className="z-50 relative"
        onClick={() => setOpen(!open)}
      >
        {t("Create")}
      </CustomButton>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[115%] right-0 flex flex-col gap-1 p-1 rounded-sm bg-[#ffffff] dark:bg-[#000000] border border-primary z-20 overflow-hidden"
          >
            {createLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-nowrap cursor-pointer"
              >
                <CustomButton
                  variants="outline"
                  className="bg-primary/10 hover:bg-primary/20 w-full z-1 relative text-end py-0.5 px-2"
                >
                  {t(`New ${link.label}`)}
                </CustomButton>
              </Link>
            ))}
            <div className="absolute inset-0 bg-primary/10 z-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateCourseDropdown;
