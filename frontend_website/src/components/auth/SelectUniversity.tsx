"use client";
import { University } from "@/types/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormProps {
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  universitySchema: string;
}

const SelectUniversity = ({
  setValue,
  errors,
  universities,
}: {
  setValue: UseFormSetValue<FormProps>;
  errors: FieldErrors<FormProps>;
  universities: University[];
}) => {
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [open, setOpen] = useState(false);
  const t = useTranslations("AuthPage");
  return (
    <div className="relative">
      <label className="block mb-0.5 font-semibold">
        {t("SelectUniversity")}
      </label>

      <div className="relative flex items-center w-full">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "relative h-10 overflow-hidden z-10 p-2 group border border-foreground/60 rounded w-full bg-background h text-start cursor-pointer",
            errors.universitySchema && "border-red-600"
          )}
        >
          <div className="absolute inset-0 z-0 group-hover:bg-primary/5 bg-primary/0 transition-colors duration-150"></div>
          {selectedSchema ? (
            <span className="z-1 relative">{selectedSchema}</span>
          ) : (
            <span className="z-1 relative">{t("SelectUniversity")}</span>
          )}
        </button>
        <motion.div
          initial={{ opacity: 0, top: "75%", scaleY: 0 }}
          animate={
            open
              ? { opacity: 1, top: "115%", scaleY: 1 }
              : { opacity: 0, top: "75%", scaleY: 0 }
          }
          transition={{ duration: 0.3, type: "tween" }}
          className="p-1 origin-top flex flex-col gap-1 rounded-sm border border-foreground/60 bg-background absolute inset-x-0 z-1"
        >
          {universities.map((schema) => (
            <button
              type="button"
              onClick={() => {
                setSelectedSchema(schema.name);
                setValue("universitySchema", schema.schema_name);
                setOpen(false);
              }}
              key={schema.id}
              className="p-2 rounded-sm border border-foreground/30 hover:bg-primary/5 transition-colors duration-150 cursor-pointer"
            >
              {schema.name}
            </button>
          ))}
        </motion.div>
      </div>

      {errors.universitySchema && (
        <p className="text-red-500 sm:text-sm absolute text-xs">
          {errors.universitySchema.message}
        </p>
      )}
    </div>
  );
};

export default SelectUniversity;
