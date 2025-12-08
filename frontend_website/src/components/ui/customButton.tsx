import { cn } from "@/lib/utils";
import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variants?: "primary" | "outline" | "destructive";
}

const CustomButton = ({
  children,
  variants,
  className,
  ...rest
}: CustomButtonProps) => {
  return (
    <button
      className={cn(
        "px-3 py-1 rounded-sm border border-primary cursor-pointer",
        variants === "primary" &&
          "bg-primary/30 dark:hover:bg-primary/20 hover:bg-primary/40",
        variants === "outline" && "bg-primary/5 hover:bg-primary/10",
        variants === "destructive" &&
          "border-red-600/40 dark:border-red-600/20 dark:bg-red-600/5 bg-red-600/20 hover:bg-red-600/30 dark:hover:bg-red-600/15",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CustomButton;
