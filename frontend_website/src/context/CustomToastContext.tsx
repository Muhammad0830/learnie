"use client";

import React, { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  visible: boolean;
}

interface CustomToastContextType {
  toasts: Toast[];
  showToast: {
    (type: ToastType, title: string, message?: string): void;
    (type: "loading", message: string): void;
  };
  removeToast: (id: string) => void;
  showLoadingToast: (message: string) => void;
  hideLoadingToast: () => void;
}

const CustomToastContext = createContext<CustomToastContextType | null>(null);

export const useCustomToast = () => {
  const ctx = useContext(CustomToastContext);
  if (!ctx)
    throw new Error("useCustomToast must be used within CustomToastProvider");
  return ctx;
};

export const CustomToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, title: string, message?: string) => {
    const id = crypto.randomUUID();

    const newToast: Toast = {
      id,
      type,
      title: title,
      message: message || "",
      visible: false,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
      );
    }, 1);

    // Only auto-remove non-loading toasts
    if (type !== "loading") {
      setTimeout(() => removeToast(id), 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 600);
  };

  const showLoadingToast = (message: string) => {
    setToasts((prev) => {
      const alreadyExists = prev.some((t) => t.type === "loading");
      if (alreadyExists) return prev;
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "loading",
          message,
          visible: false,
        },
      ];
    });

    setTimeout(() => {
      setToasts((prev) => {
        return prev.map((t) =>
          t.type === "loading" ? { ...t, visible: true } : t
        );
      });
    }, 301);
  };

  const hideLoadingToast = () => {
    setToasts((prev) =>
      prev.map((t) => (t.type === "loading" ? { ...t, visible: false } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.type !== "loading"));
    }, 600);
  };

  return (
    <CustomToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        showLoadingToast,
        hideLoadingToast,
      }}
    >
      {children}
    </CustomToastContext.Provider>
  );
};
