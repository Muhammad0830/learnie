"use client";
import { University } from "@/types/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FormProps {
  email: string;
  password: string;
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) p-1 flex flex-col gap-1">
          {universities.map((schema) => (
            <DropdownMenuItem key={schema.id} className="p-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedSchema(schema.name);
                  setValue("universitySchema", schema.schema_name);
                  setOpen(false);
                }}
                className={cn(
                  "p-2 w-full rounded-sm border border-foreground/30 hover:bg-primary/10 transition-colors duration-150 cursor-pointer",
                  selectedSchema === schema.name && "bg-primary/5"
                )}
              >
                {schema.name}
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {errors.universitySchema && (
        <p className="text-red-500 sm:text-sm absolute text-xs">
          {errors.universitySchema.message}
        </p>
      )}
    </div>
  );
};

export default SelectUniversity;
