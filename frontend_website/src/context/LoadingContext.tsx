"use client";

import React, { createContext, useContext, useState } from "react";

type LoadingContextType = {
  show: (message?: string) => void;
  hide: () => void;
  isVisible: boolean;
  message?: string;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
};

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const show = (msg?: string) => {
    setMessage(msg);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    setMessage(undefined);
  };

  return (
    <LoadingContext.Provider value={{ show, hide, isVisible, message }}>
      {children}
    </LoadingContext.Provider>
  );
};
